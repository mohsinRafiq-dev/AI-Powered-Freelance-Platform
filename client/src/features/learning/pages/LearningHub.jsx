import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen, Award, Sparkles, Search, GraduationCap, Clock,
  ChevronLeft, ChevronRight, AlertCircle,
} from 'lucide-react';
import { listCourses, recommendedCourses, getMyProgress } from '@/api/learningApi';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { InlineLoader } from '../../../components/common/Loader';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'writing', label: 'Writing & Content' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'data-entry', label: 'Data Entry' },
  { value: 'seo', label: 'SEO' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'business', label: 'Business' },
  { value: 'customer-service', label: 'Customer Service' },
  { value: 'translation', label: 'Translation' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' },
];

const LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// ─── Course Card ─────────────────────────────────────────────────────────────
const CourseCard = ({ course, showRecommendedReason }) => (
  <Link
    to={`/learning/courses/${course._id}`}
    className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand/30 transition-all duration-200"
  >
    <div className="aspect-video bg-gradient-to-br from-brand/20 to-purple-500/20 overflow-hidden relative">
      {course.thumbnailUrl ? (
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GraduationCap className="w-14 h-14 text-brand/40" />
        </div>
      )}
      {course.progressPercent > 0 && course.progressPercent < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
          <div className="h-full bg-brand" style={{ width: `${course.progressPercent}%` }} />
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge variant="outline" className="text-xs capitalize">
          {(course.category || '').replace(/-/g, ' ')}
        </Badge>
        <Badge variant="secondary" className="text-xs capitalize">{course.level}</Badge>
        {course.estimatedHours ? (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />{course.estimatedHours}h
          </span>
        ) : null}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors">
        {course.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{course.description}</p>

      {showRecommendedReason && course.newSkillsCount > 0 && (
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Adds {course.newSkillsCount} new skill{course.newSkillsCount > 1 ? 's' : ''}
        </div>
      )}

      {course.progressPercent > 0 && course.progressPercent < 100 && (
        <p className="text-xs text-gray-500 mt-2">{course.progressPercent}% complete</p>
      )}
    </div>
  </Link>
);

// ─── Learning Hub ─────────────────────────────────────────────────────────────
const LearningHub = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 12 });
  const [recommended, setRecommended] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchCourses = useCallback(async (cat, lvl, q, pg) => {
    setLoading(true);
    setError(null);
    try {
      const list = await listCourses({
        category: cat || undefined,
        level: lvl || undefined,
        search: q || undefined,
        page: pg,
        limit: 12,
      });
      setCourses(list?.data?.items || []);
      setPagination(list?.data?.pagination || { page: pg, total: 0, limit: 12 });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — also fetch recommendations and progress
  useEffect(() => {
    (async () => {
      try {
        const [rec, prog] = await Promise.allSettled([
          recommendedCourses(6),
          getMyProgress(),
        ]);
        if (rec.status === 'fulfilled') {
          setRecommended(rec.value?.data?.courses || []);
        }
        if (prog.status === 'fulfilled') {
          setProgress(prog.value?.data || null);
        }
      } catch { /* ignore sidebar failures */ }
    })();
    fetchCourses('', '', '', 1);
  }, [fetchCourses]);

  // Auto-apply filters when dropdowns change
  useEffect(() => {
    setPage(1);
    fetchCourses(category, level, search, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level]);

  const handleSearch = () => {
    setPage(1);
    fetchCourses(category, level, search, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchCourses(category, level, search, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 12));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-brand" /> Learning Hub
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Level up your skills, earn certifications, and win more jobs.
            </p>
          </div>
          <Link
            to="/learning/my"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors"
          >
            <GraduationCap className="w-4 h-4" /> My Learning
          </Link>
        </motion.div>

        {/* Stats bar */}
        {progress?.stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatBox label="Enrolled" value={progress.stats.total} />
            <StatBox label="Completed" value={progress.stats.completed} />
            <StatBox label="Certificates" value={progress.stats.certificates} icon={<Award className="w-4 h-4 text-yellow-500" />} />
            <StatBox label="Badges" value={progress.stats.badges} />
          </div>
        ) : null}

        {/* Recommended section */}
        {recommended.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand" /> Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((c) => (
                <CourseCard key={c._id} course={c} showRecommendedReason />
              ))}
            </div>
          </section>
        )}

        {/* All courses section with filters */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Courses</h2>

          {/* Filters */}
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand/30 outline-none"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand/30 outline-none"
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand/30 outline-none"
              >
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {pagination.total || 0} course{pagination.total !== 1 ? 's' : ''} found
              </span>
              <div className="flex gap-2">
                {(category || level || search) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCategory(''); setLevel(''); setSearch(''); setPage(1);
                      fetchCourses('', '', '', 1);
                    }}
                  >
                    Clear
                  </Button>
                )}
                <Button size="sm" onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <Button size="sm" variant="outline" onClick={() => fetchCourses(category, level, search, page)} className="ml-auto">
                Retry
              </Button>
            </div>
          )}

          {/* Course grid */}
          {loading ? (
            <div className="py-12"><InlineLoader text="Loading courses" /></div>
          ) : courses.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">No courses found</p>
              <p className="text-sm text-gray-500 mt-1">Try different filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((c) => <CourseCard key={c._id} course={c} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-brand text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
  </div>
);

export default LearningHub;
