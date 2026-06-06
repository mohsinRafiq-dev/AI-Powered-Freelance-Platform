import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DollarSign, Clock, FileText, AlertCircle, Send, Sparkles, RefreshCw,
  Tag, CheckCircle, XCircle, TrendingUp, Lightbulb, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import toast from 'react-hot-toast';
import { useGenerateProposalDraft, useRegenerateProposalDraft } from '@/hooks/api/useProposals';
import { useAIFeatureStatus } from '@/hooks/api/useAdminSettings';
import { scoreProposal, getJobKeywords } from '@/api/proposalsApi';
import AIGenerationStatus from './AIGenerationStatus';
import logger from '@/utils/logger';

// ─── Score Ring ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 64, label }) => {
  const radius = (size / 2) - 6;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * (score / 100);
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
          strokeWidth={5} className="text-gray-200 dark:text-gray-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
          strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div className="relative" style={{ marginTop: -size / 2 - 4 }}>
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      {label && <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{label}</span>}
    </div>
  );
};

// ─── ProposalForm ─────────────────────────────────────────────────────────────
export const ProposalForm = ({ job, onSubmit, loading, error, initialData = null }) => {
  const [formData, setFormData] = useState({
    coverLetter: initialData?.coverLetter || '',
    proposedPrice: initialData?.bidAmount || initialData?.proposedPrice || '',
    deliveryTime: initialData?.deliveryTime || '',
  });

  const [errors, setErrors] = useState({});
  const [aiStatus, setAiStatus] = useState('idle'); // idle | loading | success | error
  const [aiError, setAiError] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);

  // Keyword optimization state
  const [keywords, setKeywords] = useState(null); // { primary, secondary, skills, avoid }
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);

  // NLP scoring state
  const [nlpScore, setNlpScore] = useState(null); // full scoring result
  const [nlpLoading, setNlpLoading] = useState(false);
  const [showScorePanel, setShowScorePanel] = useState(false);
  const scoreTimerRef = useRef(null);

  const { data: aiFeatureStatus } = useAIFeatureStatus();
  const aiEnabled = aiFeatureStatus?.data?.aiEnabled && aiFeatureStatus?.data?.features?.proposalGeneration;

  const { mutateAsync: generateDraft, isLoading: isGenerating } = useGenerateProposalDraft();
  const { mutateAsync: regenerateDraft, isLoading: isRegenerating } = useRegenerateProposalDraft();
  const isAIGenerating = isGenerating || isRegenerating;

  const isEditing = !!initialData;
  const characterCount = formData.coverLetter.length;
  const jobId = job?._id || job?.id;

  // ── Fetch keywords — cached in sessionStorage to save API quota ───────────
  useEffect(() => {
    if (!jobId || !aiEnabled) return;
    const cacheKey = `kw_${jobId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { setKeywords(JSON.parse(cached)); return; } catch { /* ignore corrupt cache */ }
    }
    (async () => {
      setKeywordsLoading(true);
      try {
        const res = await getJobKeywords(jobId);
        const data = res?.data || null;
        setKeywords(data);
        if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch { /* silent */ }
      finally { setKeywordsLoading(false); }
    })();
  }, [jobId, aiEnabled]);

  // ── Manual score trigger — called only via button, not auto-typed ──────────
  const handleScoreProposal = async () => {
    if (!aiEnabled || formData.coverLetter.length < 100 || !jobId) return;
    setNlpLoading(true);
    try {
      const res = await scoreProposal(jobId, formData.coverLetter);
      setNlpScore(res?.data || null);
      setShowScorePanel(true);
    } catch { /* silent */ }
    finally { setNlpLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.coverLetter || formData.coverLetter.length < 100)
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    if (formData.coverLetter && formData.coverLetter.length > 2000)
      newErrors.coverLetter = 'Cover letter cannot exceed 2000 characters';
    if (!formData.proposedPrice || formData.proposedPrice <= 0)
      newErrors.proposedPrice = 'Proposed price must be greater than 0';
    if (formData.proposedPrice && formData.proposedPrice < 500)
      newErrors.proposedPrice = 'Proposed price must be at least PKR 500';
    if (!formData.deliveryTime || formData.deliveryTime <= 0)
      newErrors.deliveryTime = 'Delivery time must be at least 1 day';
    if (formData.deliveryTime > 365)
      newErrors.deliveryTime = 'Delivery time cannot exceed 365 days';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (!jobId) { setErrors({ general: 'Job ID is missing' }); return; }
      onSubmit({
        jobId,
        coverLetter: formData.coverLetter.trim(),
        bidAmount: parseFloat(formData.proposedPrice),
        deliveryTime: parseInt(formData.deliveryTime),
      });
    }
  };

  const applyDraft = (draft) => {
    setFormData({
      coverLetter: draft.coverLetter || formData.coverLetter,
      proposedPrice: draft.bidAmount || formData.proposedPrice,
      deliveryTime: draft.deliveryTime || formData.deliveryTime,
    });
    setAiConfidence(draft.confidence);
    setAiStatus('success');
  };

  const handleGenerateWithAI = async () => {
    if (!jobId) { setAiError('Job information is missing'); setAiStatus('error'); return; }
    setAiStatus('loading');
    setAiError(null);
    try {
      const result = await generateDraft(jobId);
      if (result?.data?.draft) { applyDraft(result.data.draft); toast.success('Proposal generated!'); }
    } catch (err) {
      logger.error('AI generation error:', err);
      setAiError(err.response?.data?.message || 'Failed to generate. Please try manually.');
      setAiStatus('error');
      toast.error('AI generation failed');
    }
  };

  const handleRegenerate = async () => {
    if (!jobId) return;
    setAiStatus('loading');
    setAiError(null);
    try {
      const result = await regenerateDraft(jobId);
      if (result?.data?.draft) { applyDraft(result.data.draft); toast.success('Proposal regenerated!'); }
    } catch (err) {
      setAiError(err.response?.data?.message || 'Failed to regenerate.');
      setAiStatus('error');
    }
  };

  // Count keywords present in cover letter
  const countKeywordsPresent = (kwList) => {
    if (!kwList?.length || !formData.coverLetter) return 0;
    const lower = formData.coverLetter.toLowerCase();
    return kwList.filter((k) => lower.includes(k.toLowerCase())).length;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── AI Proposal Assistant Section ─────────────────────────────────── */}
      {aiEnabled && !isEditing && (
        <div className="bg-gradient-to-br from-brand/5 to-purple-500/5 border border-brand/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              <h3 className="font-bold text-gray-900 dark:text-white">AI Proposal Assistant</h3>
              {aiStatus === 'success' && aiConfidence && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {aiConfidence}% confidence
                </span>
              )}
            </div>
            {aiStatus === 'success' && (
              <Button type="button" variant="outline" size="sm" onClick={handleRegenerate} disabled={isAIGenerating}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isAIGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </div>

          {aiStatus === 'idle' && (
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={isAIGenerating || !job}
              className="w-full bg-gradient-to-r from-brand to-purple-600 hover:from-purple-600 hover:to-brand text-white shadow-md"
            >
              <Sparkles className={`w-5 h-5 mr-2 ${isAIGenerating ? 'animate-pulse' : ''}`} />
              {isAIGenerating ? 'Generating your proposal...' : 'Generate Proposal with AI'}
            </Button>
          )}

          <AIGenerationStatus
            status={aiStatus}
            confidence={aiConfidence}
            error={aiError}
            onRetry={handleGenerateWithAI}
          />

          {aiStatus === 'success' && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
              AI-generated content is fully editable. Review and personalize before submitting.
            </p>
          )}
        </div>
      )}

      {!aiEnabled && !isEditing && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-xs text-gray-500">AI proposal generation is currently disabled. Fill the form manually.</p>
        </div>
      )}

      {/* ── Keyword Optimization Panel ──────────────────────────────────────── */}
      {aiEnabled && keywords && !isEditing && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowKeywords((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Keyword Optimization</span>
              {!keywordsLoading && keywords.primary?.length > 0 && (
                <span className="text-xs text-gray-500">
                  {countKeywordsPresent(keywords.primary)}/{keywords.primary.length} primary keywords used
                </span>
              )}
            </div>
            {showKeywords ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showKeywords && (
            <div className="p-4 space-y-4">
              {keywordsLoading ? (
                <p className="text-sm text-gray-500 animate-pulse">Extracting keywords...</p>
              ) : (
                <>
                  {/* Primary keywords */}
                  {keywords.primary?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                        Must-have keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {keywords.primary.map((kw) => {
                          const present = formData.coverLetter.toLowerCase().includes(kw.toLowerCase());
                          return (
                            <span
                              key={kw}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                present
                                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                  : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                              }`}
                            >
                              {present ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {kw}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Secondary keywords */}
                  {keywords.secondary?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                        Helpful keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {keywords.secondary.map((kw) => {
                          const present = formData.coverLetter.toLowerCase().includes(kw.toLowerCase());
                          return (
                            <span
                              key={kw}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${
                                present
                                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {kw}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Green = used in your letter · Red = missing · Click keywords to see them in context
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Job Budget ──────────────────────────────────────────────────────── */}
      {job?.budget && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Client's Budget</h3>
          </div>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">PKR {job.budget?.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Final payment managed through project milestones after hiring</p>
        </div>
      )}

      {/* ── Cover Letter ────────────────────────────────────────────────────── */}
      <div>
        <Label htmlFor="coverLetter" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand" />
          Cover Letter <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          rows={10}
          className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
            errors.coverLetter
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-brand'
          } text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all resize-none`}
          placeholder="Explain why you're the best fit for this job. Highlight relevant experience and your approach..."
        />
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs ${
            characterCount < 100 || characterCount > 2000 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {characterCount}/2000 characters
            {characterCount < 100 && ` — ${100 - characterCount} more needed`}
          </span>
          <div className="flex items-center gap-2">
            {characterCount >= 100 && characterCount <= 2000 && (
              <span className="text-xs text-green-600 dark:text-green-400">✓ Good length</span>
            )}
            {aiEnabled && !isEditing && characterCount >= 100 && (
              <button
                type="button"
                onClick={handleScoreProposal}
                disabled={nlpLoading}
                className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 transition-colors disabled:opacity-50"
              >
                <TrendingUp className="w-3 h-3" />
                {nlpLoading ? 'Analyzing...' : 'Analyze Quality'}
              </button>
            )}
          </div>
        </div>
        {errors.coverLetter && (
          <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.coverLetter}</span>
          </div>
        )}
      </div>

      {/* ── NLP Relevance Score Panel ──────────────────────────────────────── */}
      {aiEnabled && nlpScore && !isEditing && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowScorePanel((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Proposal Quality Score</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                nlpScore.overall_score >= 75 ? 'bg-green-100 text-green-700' :
                nlpScore.overall_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {nlpScore.overall_score}/100
              </span>
            </div>
            {showScorePanel ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showScorePanel && (
            <div className="p-4 space-y-5">
              {/* Score rings */}
              <div className="grid grid-cols-4 gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <ScoreRing score={nlpScore.scores.relevance} label="Relevance" />
                <ScoreRing score={nlpScore.scores.keyword_match} label="Keywords" />
                <ScoreRing score={nlpScore.scores.clarity} label="Clarity" />
                <ScoreRing score={nlpScore.scores.persuasiveness} label="Impact" />
              </div>

              {/* Matched keywords */}
              {nlpScore.matched_keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                    ✓ Keywords found in your proposal
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nlpScore.matched_keywords.map((k) => (
                      <span key={k} className="px-2 py-0.5 rounded-full text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing keywords */}
              {nlpScore.missing_keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                    ✗ Missing keywords — add these to rank higher
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nlpScore.missing_keywords.map((k) => (
                      <span key={k} className="px-2 py-0.5 rounded-full text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {nlpScore.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {nlpScore.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvement suggestions */}
              {nlpScore.suggestions?.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> AI Improvement Tips
                  </p>
                  <ul className="space-y-1.5">
                    {nlpScore.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-1.5">
                        <span className="font-bold flex-shrink-0">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Bid & Delivery ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="proposedPrice" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand" />
            Your Proposed Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">PKR</span>
            <Input
              type="number"
              id="proposedPrice"
              name="proposedPrice"
              value={formData.proposedPrice}
              onChange={handleChange}
              min="500"
              step="100"
              placeholder="5000"
              className={`pl-14 ${errors.proposedPrice ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.proposedPrice && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.proposedPrice}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="deliveryTime" className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            Delivery Time <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              id="deliveryTime"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              min="1"
              max="365"
              placeholder="e.g., 7"
              className={errors.deliveryTime ? 'border-red-500' : ''}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">days</span>
          </div>
          {errors.deliveryTime && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.deliveryTime}
            </p>
          )}
        </div>
      </div>

      {/* ── General Error ───────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>
          ) : (
            <><Send className="w-5 h-5 mr-2" />{isEditing ? 'Update Proposal' : 'Submit Proposal'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProposalForm;
