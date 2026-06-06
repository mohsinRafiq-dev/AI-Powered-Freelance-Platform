import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen, CheckCircle, Circle, Award, Clock, Play, AlertCircle,
  Trophy, ChevronRight, ChevronLeft, XCircle, Timer,
} from 'lucide-react';
import { getCourse, enrollInCourse, markLessonComplete, submitAssessment } from '@/api/learningApi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { InlineLoader } from '../../../components/common/Loader';

// ─── Assessment Timer ──────────────────────────────────────────────────────
const useTimer = (minutes, onExpire) => {
  const [secsLeft, setSecsLeft] = useState(minutes * 60);
  const ref = useRef(null);

  useEffect(() => {
    if (!minutes) return;
    ref.current = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) { clearInterval(ref.current); onExpire?.(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [minutes]);

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  return { display: `${mm}:${ss}`, urgent: secsLeft <= 60 };
};

// ─── Main Component ────────────────────────────────────────────────────────
const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [answers, setAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const refresh = async (preserveLessonId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourse(id);
      const data = res?.data?.course || res?.data;
      if (!data) throw new Error('Course not found');
      setCourse(data);

      // Re-sync active lesson from refreshed data to avoid stale content
      const lessonToShow = preserveLessonId || activeLessonId;
      if (lessonToShow) {
        const synced = data.lessons?.find((l) => String(l._id) === String(lessonToShow));
        if (synced) setActiveLesson(synced);
      } else if (data?.lessons?.length) {
        setActiveLesson(data.lessons[0]);
        setActiveLessonId(String(data.lessons[0]._id));
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 flex items-center justify-center">
      <InlineLoader text="Loading course" />
    </div>
  );

  if (error || !course) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Course not found.'}</p>
        <Button onClick={() => navigate('/learning')}>Back to Learning Hub</Button>
      </div>
    </div>
  );

  const enrollment = course.enrollment;
  const completedSet = new Set((enrollment?.completedLessons || []).map(String));
  const allLessonsDone = course.lessons.length > 0 && course.lessons.every((l) => completedSet.has(String(l._id)));
  const currentLessonIdx = course.lessons.findIndex((l) => String(l._id) === String(activeLesson?._id));

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveLessonId(String(lesson._id));
    setShowAssessment(false);
    setAssessmentResult(null);
    setSubmitted(false);
  };

  const handleEnroll = async () => {
    setBusy(true);
    try {
      await enrollInCourse(id);
      await refresh(activeLessonId);
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed');
    } finally { setBusy(false); }
  };

  const handleComplete = async (lessonId) => {
    setBusy(true);
    try {
      await markLessonComplete(id, lessonId);
      await refresh(lessonId);
      toast.success('Lesson completed!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to mark complete');
    } finally { setBusy(false); }
  };

  const handleSubmitAssessment = async () => {
    const questions = course.assessment.questions;
    const ordered = questions.map((q) => Number(answers[q._id] ?? -1));
    if (ordered.some((a) => a < 0)) {
      toast.error('Please answer all questions before submitting.');
      return;
    }
    setBusy(true);
    try {
      const res = await submitAssessment(id, ordered);
      const result = res?.data || res;
      setAssessmentResult(result);
      setSubmitted(true);
      await refresh(activeLessonId);
      if (result.passed) {
        toast.success('Congratulations! You passed!');
      } else {
        toast(`Score: ${result.score}% — You need ${course.assessment.passingScore}% to pass. Try again!`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/learning')} className="mb-4">
          ← Back to Learning Hub
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-fit sticky top-28">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-brand" />
              <h2 className="font-semibold">Course Content</h2>
            </div>

            {!enrollment ? (
              <Button onClick={handleEnroll} disabled={busy} className="w-full mb-3">
                {busy ? 'Enrolling...' : 'Enroll to Start'}
              </Button>
            ) : (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{enrollment.progressPercent}% complete</span>
                  <span>{completedSet.size}/{course.lessons.length} lessons</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all duration-500"
                    style={{ width: `${enrollment.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <ul className="space-y-1">
              {course.lessons.map((l, i) => {
                const done = completedSet.has(String(l._id));
                const active = String(activeLesson?._id) === String(l._id);
                return (
                  <li key={l._id}>
                    <button
                      onClick={() => openLesson(l)}
                      className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                        active
                          ? 'bg-brand/10 text-brand font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {done
                        ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        : <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      <span className="flex-1 truncate">{i + 1}. {l.title}</span>
                      {l.durationMinutes ? (
                        <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{l.durationMinutes}m
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {course.assessment?.questions?.length > 0 && (
              <button
                onClick={() => {
                  setShowAssessment(true);
                  setActiveLesson(null);
                  setActiveLessonId(null);
                  setAssessmentResult(null);
                  setAnswers({});
                  setSubmitted(false);
                }}
                disabled={!enrollment || !allLessonsDone}
                className={`w-full mt-3 px-3 py-2.5 rounded text-sm flex items-center justify-center gap-2 font-medium transition-colors ${
                  enrollment && allLessonsDone
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-700/30 text-gray-500'
                }`}
              >
                <Award className="w-4 h-4" />
                {enrollment?.certified ? 'Retake Assessment' : 'Take Assessment'}
              </button>
            )}

            {enrollment?.certified && (
              <Link
                to={`/learning/courses/${id}/certificate`}
                className="w-full mt-2 px-3 py-2.5 rounded text-sm flex items-center justify-center gap-2 font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                <Award className="w-4 h-4" /> View Certificate
              </Link>
            )}
          </aside>

          {/* Main content */}
          <main className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[500px]">
            {/* Course header */}
            <div className="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="capitalize">{course.category?.replace(/-/g, ' ')}</Badge>
                <Badge variant="secondary" className="capitalize">{course.level}</Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{course.estimatedHours}h total
                </span>
                {enrollment?.certified && (
                  <Badge className="flex items-center gap-1 bg-green-500 text-white">
                    <Award className="w-3 h-3" /> Certified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{course.description}</p>
            </div>

            {/* Badges */}
            {enrollment?.badges?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {enrollment.badges.map((b) => (
                  <span
                    key={b.code}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium"
                    title={b.awardedAt ? `Earned ${new Date(b.awardedAt).toLocaleDateString()}` : ''}
                  >
                    <Trophy className="w-3 h-3" /> {b.title}
                  </span>
                ))}
              </div>
            )}

            {/* Assessment */}
            {showAssessment && (
              <Assessment
                course={course}
                answers={answers}
                setAnswers={setAnswers}
                onSubmit={handleSubmitAssessment}
                result={assessmentResult}
                busy={busy}
                submitted={submitted}
                onRetry={() => {
                  setAssessmentResult(null);
                  setAnswers({});
                  setSubmitted(false);
                }}
              />
            )}

            {/* Lesson content */}
            {!showAssessment && activeLesson && (
              <article>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-brand" />
                  {currentLessonIdx + 1}. {activeLesson.title}
                </h2>

                {activeLesson.videoUrl && (
                  <div className="aspect-video bg-gray-900 rounded-lg mb-4 overflow-hidden">
                    <iframe
                      src={activeLesson.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      title={activeLesson.title}
                    />
                  </div>
                )}

                <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  {activeLesson.content}
                </div>

                <div className="mt-6 flex items-center gap-3 flex-wrap">
                  {enrollment && !completedSet.has(String(activeLesson._id)) ? (
                    <Button onClick={() => handleComplete(activeLesson._id)} disabled={busy}>
                      {busy ? 'Saving...' : '✓ Mark Complete'}
                    </Button>
                  ) : enrollment ? (
                    <div className="inline-flex items-center gap-2 text-green-600 font-medium text-sm">
                      <CheckCircle className="w-4 h-4" /> Lesson completed
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-yellow-600 text-sm">
                      <AlertCircle className="w-4 h-4" /> Enroll to track progress
                    </div>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {currentLessonIdx > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLesson(course.lessons[currentLessonIdx - 1])}
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </Button>
                    )}
                    {currentLessonIdx < course.lessons.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLesson(course.lessons[currentLessonIdx + 1])}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            )}

            {!showAssessment && !activeLesson && (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a lesson from the sidebar to begin</p>
                </div>
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Assessment Component ──────────────────────────────────────────────────
const Assessment = ({ course, answers, setAnswers, onSubmit, result, busy, submitted, onRetry }) => {
  const timeLimitMinutes = course.assessment?.timeLimitMinutes;
  const { display: timerDisplay, urgent: timerUrgent } = useTimer(
    submitted ? 0 : timeLimitMinutes,
    () => { if (!submitted) onSubmit(); }
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" /> Assessment
        </h2>
        {timeLimitMinutes && !submitted && (
          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-full ${timerUrgent ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            <Timer className="w-4 h-4" /> {timerDisplay}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        Passing score: <strong>{course.assessment.passingScore}%</strong> ·
        {course.assessment.questions.length} questions
        {timeLimitMinutes ? ` · ${timeLimitMinutes} minute limit` : ''}
      </p>

      {/* Result summary */}
      {result && (
        <div className={`p-4 rounded-lg mb-6 border ${result.passed ? 'bg-green-50 dark:bg-green-900/20 border-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-300'}`}>
          <div className="font-bold text-lg flex items-center gap-2">
            {result.passed
              ? <><CheckCircle className="w-5 h-5 text-green-500" /> Passed!</>
              : <><XCircle className="w-5 h-5 text-red-500" /> Not quite — try again</>}
          </div>
          <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            Score: <strong>{result.score}%</strong> ({result.correctAnswers}/{result.totalQuestions} correct)
          </div>
          {result.passed && result.enrollment?.certificateCode && (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded">
                Certificate ID: {result.enrollment.certificateCode}
              </span>
              <Link
                to={`/learning/courses/${course._id}/certificate`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded font-medium"
              >
                <Award className="w-3 h-3" /> View Certificate
              </Link>
            </div>
          )}
          {!result.passed && (
            <Button size="sm" variant="outline" onClick={onRetry} className="mt-3">
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Questions */}
      <ol className="space-y-6">
        {course.assessment.questions.map((q, idx) => {
          const questionResult = result?.details?.[idx];
          return (
            <li key={q._id} className={`p-4 rounded-lg border ${
              questionResult
                ? questionResult.isCorrect
                  ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10'
                  : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <p className="font-medium mb-3 text-gray-900 dark:text-white">
                {idx + 1}. {q.question}
                {questionResult && (
                  <span className={`ml-2 text-xs font-normal ${questionResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {questionResult.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                )}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isChosen = answers[q._id] === optIdx;
                  const isCorrectAnswer = questionResult && optIdx === questionResult.correctIndex;
                  const isWrongChosen = questionResult && isChosen && !questionResult.isCorrect;

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                        isCorrectAnswer && submitted
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                          : isWrongChosen
                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                            : isChosen
                              ? 'border-brand bg-brand/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q._id}`}
                        checked={isChosen}
                        onChange={() => !submitted && setAnswers((a) => ({ ...a, [q._id]: optIdx }))}
                        disabled={submitted}
                        className="accent-brand"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-200">{opt}</span>
                      {isCorrectAnswer && submitted && <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                    </label>
                  );
                })}
              </div>

              {/* Per-question explanation after submit */}
              {questionResult?.explanation && (
                <div className="mt-3 p-2.5 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  <strong>Explanation:</strong> {questionResult.explanation}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted && (
        <Button className="mt-6" onClick={onSubmit} disabled={busy}>
          {busy ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      )}
    </div>
  );
};

export default CourseDetails;
