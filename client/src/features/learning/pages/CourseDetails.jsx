import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, CheckCircle, Circle, Award, Clock, Play, AlertCircle, Trophy,
} from 'lucide-react';
import { getCourse, enrollInCourse, markLessonComplete, submitAssessment } from '@/api/learningApi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { InlineLoader } from '../../../components/common/Loader';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [answers, setAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getCourse(id);
      const data = res?.data?.course || res?.data;
      setCourse(data);
      if (!activeLesson && data?.lessons?.length) {
        setActiveLesson(data.lessons[0]);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 flex items-center justify-center"><InlineLoader text="Loading course" /></div>;
  }
  if (!course) {
    return <div className="min-h-screen pt-24 text-center">Course not found.</div>;
  }

  const enrollment = course.enrollment;
  const completedSet = new Set((enrollment?.completedLessons || []).map(String));
  const allLessonsDone = course.lessons.length > 0 && course.lessons.every((l) => completedSet.has(String(l._id)));

  const handleEnroll = async () => {
    setBusy(true);
    try { await enrollInCourse(id); await refresh(); } finally { setBusy(false); }
  };

  const handleComplete = async (lessonId) => {
    setBusy(true);
    try { await markLessonComplete(id, lessonId); await refresh(); } finally { setBusy(false); }
  };

  const handleSubmitAssessment = async () => {
    const ordered = course.assessment.questions.map((q) => Number(answers[q._id] ?? -1));
    if (ordered.some((a) => a < 0)) {
      alert('Please answer all questions.');
      return;
    }
    setBusy(true);
    try {
      const res = await submitAssessment(id, ordered);
      setAssessmentResult(res?.data || res);
      await refresh();
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/learning')} className="mb-4">← Back to Hub</Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar — lesson list */}
          <aside className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-brand" />
              <h2 className="font-semibold">Lessons</h2>
            </div>
            {!enrollment ? (
              <Button onClick={handleEnroll} disabled={busy} className="w-full mb-3">
                Enroll to start
              </Button>
            ) : (
              <div className="mb-3">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div className="h-full bg-brand" style={{ width: `${enrollment.progressPercent}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{enrollment.progressPercent}% complete</p>
              </div>
            )}
            <ul className="space-y-1">
              {course.lessons.map((l, i) => {
                const done = completedSet.has(String(l._id));
                const active = activeLesson?._id === l._id;
                return (
                  <li key={l._id}>
                    <button
                      onClick={() => { setActiveLesson(l); setShowAssessment(false); }}
                      className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${active ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                    >
                      {done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-400" />}
                      <span className="flex-1">{i + 1}. {l.title}</span>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{l.durationMinutes || 0}m</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {course.assessment?.questions?.length > 0 ? (
              <button
                onClick={() => { setShowAssessment(true); setActiveLesson(null); setAssessmentResult(null); }}
                disabled={!enrollment || !allLessonsDone}
                className={`w-full mt-3 px-3 py-2 rounded text-sm flex items-center gap-2 ${enrollment && allLessonsDone ? 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20' : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700/30'}`}
              >
                <Award className="w-4 h-4" /> Take Assessment
              </button>
            ) : null}
          </aside>

          {/* Main content */}
          <main className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="secondary" className="capitalize">{course.level}</Badge>
                <span className="text-xs text-gray-500">{course.estimatedHours}h total</span>
                {enrollment?.certified ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> Certified
                  </Badge>
                ) : null}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-3">{course.description}</p>
            </div>

            {enrollment?.badges?.length ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {enrollment.badges.map((b) => (
                  <span key={b.code} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs">
                    <Trophy className="w-3 h-3" /> {b.title}
                  </span>
                ))}
              </div>
            ) : null}

            {showAssessment ? (
              <Assessment
                course={course}
                answers={answers}
                setAnswers={setAnswers}
                onSubmit={handleSubmitAssessment}
                result={assessmentResult}
                busy={busy}
              />
            ) : activeLesson ? (
              <article>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-brand" /> {activeLesson.title}
                </h2>
                {activeLesson.videoUrl ? (
                  <div className="aspect-video bg-black rounded mb-4 flex items-center justify-center text-white">
                    <a href={activeLesson.videoUrl} target="_blank" rel="noreferrer" className="underline">Watch on external site</a>
                  </div>
                ) : null}
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {activeLesson.content}
                </div>
                {enrollment && !completedSet.has(String(activeLesson._id)) ? (
                  <Button className="mt-6" onClick={() => handleComplete(activeLesson._id)} disabled={busy}>
                    Mark Lesson Complete
                  </Button>
                ) : enrollment ? (
                  <div className="mt-6 inline-flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" /> Lesson complete
                  </div>
                ) : (
                  <div className="mt-6 inline-flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="w-4 h-4" /> Enroll to track progress
                  </div>
                )}
              </article>
            ) : null}
          </main>
        </motion.div>
      </div>
    </div>
  );
};

const Assessment = ({ course, answers, setAnswers, onSubmit, result, busy }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" /> Assessment
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Passing score: {course.assessment.passingScore}% · {course.assessment.questions.length} questions
      </p>

      {result ? (
        <div className={`p-4 rounded mb-4 ${result.passed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
          <div className="font-bold text-lg">
            {result.passed ? '🎉 Passed!' : 'Not quite — try again'}
          </div>
          <div className="text-sm mt-1">
            Score: {result.score}% ({result.correctAnswers}/{result.totalQuestions} correct)
          </div>
          {result.enrollment?.certificateCode ? (
            <div className="text-sm mt-2 font-mono bg-white dark:bg-gray-800 px-2 py-1 inline-block rounded">
              Certificate: {result.enrollment.certificateCode}
            </div>
          ) : null}
        </div>
      ) : null}

      <ol className="space-y-6">
        {course.assessment.questions.map((q, idx) => (
          <li key={q._id}>
            <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${answers[q._id] === optIdx ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    name={`q-${q._id}`}
                    checked={answers[q._id] === optIdx}
                    onChange={() => setAnswers((a) => ({ ...a, [q._id]: optIdx }))}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <Button className="mt-6" onClick={onSubmit} disabled={busy}>
        {busy ? 'Submitting...' : 'Submit Assessment'}
      </Button>
    </div>
  );
};

export default CourseDetails;
