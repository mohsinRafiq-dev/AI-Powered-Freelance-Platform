import mongoose from 'mongoose';

/**
 * Captures user feedback on AI-driven recommendations and rankings.
 * This data is aggregated by the AI learning service to adjust matching
 * weights and prompt heuristics over time (continuous learning loop).
 */
const aiFeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The kind of AI artifact being scored
    surface: {
      type: String,
      enum: [
        'job_recommendation',
        'freelancer_recommendation',
        'proposal_ranking',
        'proposal_draft',
        'fake_review_detection',
      ],
      required: true,
      index: true,
    },
    // The user's reaction
    signal: {
      type: String,
      enum: ['shown', 'clicked', 'applied', 'hired', 'completed', 'dismissed', 'thumbs_up', 'thumbs_down'],
      required: true,
    },
    // What the AI predicted/scored (e.g. {aiScore: 87, confidence: 0.9})
    prediction: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // The actual outcome (filled in later for delayed feedback signals)
    outcome: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // References to the related entities
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    // Snapshot of relevant skills/categories so we can aggregate even if entities change later
    skills: [{ type: String, lowercase: true }],
    category: { type: String },
    // Free-form notes for prompt tuning
    note: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

aiFeedbackSchema.index({ surface: 1, signal: 1, createdAt: -1 });
aiFeedbackSchema.index({ category: 1, signal: 1 });

const AIFeedback = mongoose.model('AIFeedback', aiFeedbackSchema);
export default AIFeedback;
