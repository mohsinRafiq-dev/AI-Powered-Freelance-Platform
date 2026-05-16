import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Sparkles, Search, GraduationCap } from 'lucide-react';
import { listCourses, recommendedCourses, getMyProgress } from '@/api/learningApi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { InlineLoader } from '../../../components/common/Loader';

const CATEGORIES = [
  '', 'web-development', 'mobile-development', 'design', 'writing', 'marketing',
  'video-editing', 'data-entry', 'seo', 'social-media', 'business',
];
const LEVELS = ['', 'beginner', 'intermediate', 'advanced'];

const CourseCard = ({ course, showRecommendedReason }) => (
  <Link
    to={`/learning/courses/${course._id}`}
    className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition"
  >
    <div className="aspect-video bg-gradient-to-br from-brand/20 to-purple-500/20 flex items-center justify-center">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
      ) : (
        <GraduationCap className="w-12 h-12 text-brand" />
      )}
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge variant="outline" className="text-xs">{course.category}</Badge>
        <Badge variant="secondary" className="text-xs capitalize">{course.level}</Badge>
        {course.estimatedHours ? (
          <span className="text-xs text-gray-500">{course.estimatedHours}h</span>
        ) : null}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{course.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{course.description}</p>
      {showRecommendedReason && course.newSkillsCount > 0 ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-brand">
          <Sparkles className="w-3.5 h-3.5" /> Adds {course.newSkillsCount} new skill{course.newSkillsCount > 1 ? 's' : ''}
        </div>
      ) : null}
      {course.progressPercent > 0 && course.progressPercent < 100 ? (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${course.progressPercent}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{course.progressPercent}% complete</p>
        </div>
      ) : null}
    </div>
  </Link>
);

const LearningHub = () => {
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [list, rec, prog] = await Promise.all([
        listCourses({ category: category || undefined, level: level || undefined, search: search || undefined }),
        recommendedCourses(6),
        getMyProgress(),
      ]);
      setCourses(list?.data?.items || list?.data || []);
      setRecommended(rec?.data?.courses || []);
      setProgress(prog?.data || null);
    } catch (err) {
      console.error('Learning Hub fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand" /> Learning Hub
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Level up your skills. Earn certifications. Win more jobs.
          </p>
        </motion.div>

        {progress?.stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatBox label="Enrolled" value={progress.stats.total} />
            <StatBox label="Completed" value={progress.stats.completed} />
            <StatBox label="Certificates" value={progress.stats.certificates} icon={<Award className="w-4 h-4 text-yellow-500" />} />
            <StatBox label="Badges" value={progress.stats.badges} />
          </div>
        ) : null}

        {recommended.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand" /> Recommended for you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((c) => (
                <CourseCard key={c._id} course={c} showRecommendedReason />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                  className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-2 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All categories'}</option>)}
              </select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-2 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm">
                {LEVELS.map((l) => <option key={l} value={l}>{l || 'All levels'}</option>)}
              </select>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={fetchData}>Apply</Button>
            </div>
          </div>

          {loading ? (
            <InlineLoader text="Loading courses" />
          ) : courses.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No courses found. Try changing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c) => <CourseCard key={c._id} course={c} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase text-gray-500">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
  </div>
);

export default LearningHub;
