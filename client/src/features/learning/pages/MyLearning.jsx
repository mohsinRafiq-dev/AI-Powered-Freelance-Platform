import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, BookOpen, Trophy, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';
import { getMyProgress } from '@/api/learningApi';
import { InlineLoader } from '../../../components/common/Loader';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

const MyLearning = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBadges, setExpandedBadges] = useState({});

  const fetchProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProgress();
      setData(res?.data || null);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load your progress';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProgress(); }, []);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <InlineLoader text="Loading your progress" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={fetchProgress} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-brand" /> My Learning
          </h1>
          <Link
            to="/learning"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <BookOpen className="w-4 h-4" /> Browse Courses
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Track your progress, badges, and certifications.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatBox label="Enrolled" value={data?.stats?.total || 0} />
          <StatBox label="Completed" value={data?.stats?.completed || 0} />
          <StatBox
            label="Certificates"
            value={data?.stats?.certificates || 0}
            icon={<Award className="w-4 h-4 text-yellow-500" />}
          />
          <StatBox
            label="Badges"
            value={data?.stats?.badges || 0}
            icon={<Trophy className="w-4 h-4 text-yellow-500" />}
          />
        </div>

        {/* Certificates */}
        {data?.certificates?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" /> My Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certificates.map((c) => (
                <div
                  key={c.certificateCode}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-300 border-yellow-300">
                      ✓ Certified
                    </Badge>
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                    {c.course?.title || 'Course'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Final Score: <strong>{c.bestScore}%</strong> ·{' '}
                    {c.certifiedAt ? new Date(c.certifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </p>
                  <p className="text-xs font-mono mt-2 bg-white dark:bg-gray-800 inline-block px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                    {c.certificateCode}
                  </p>
                  {c.course?._id && (
                    <div className="mt-3">
                      <Link
                        to={`/learning/courses/${c.course._id}/certificate`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" /> View & Print Certificate
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Enrolled Courses */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-brand" /> My Courses
          </h2>

          {!data?.enrollments?.length ? (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
                You haven't enrolled in any courses yet.
              </p>
              <Link
                to="/learning"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium"
              >
                Browse Learning Hub
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.enrollments.map((e) => {
                const showAllBadges = expandedBadges[e._id];
                const badges = e.badges || [];
                const visibleBadges = showAllBadges ? badges : badges.slice(0, 3);

                return (
                  <div
                    key={e._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/learning/courses/${e.course?._id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-brand transition-colors"
                        >
                          {e.course?.title || 'Course'}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {e.course?.category && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {e.course.category.replace(/-/g, ' ')}
                            </Badge>
                          )}
                          {e.course?.level && (
                            <Badge variant="secondary" className="text-xs capitalize">{e.course.level}</Badge>
                          )}
                          {e.certified && (
                            <Badge className="text-xs bg-green-500 text-white">Certified</Badge>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{e.progressPercent}% complete</span>
                            {e.bestScore > 0 && <span>Best score: {e.bestScore}%</span>}
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                e.progressPercent === 100 ? 'bg-green-500' : 'bg-brand'
                              }`}
                              style={{ width: `${e.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Badges */}
                        {badges.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                            {visibleBadges.map((b) => (
                              <span
                                key={b.code}
                                className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-medium"
                                title={b.awardedAt ? `Earned ${new Date(b.awardedAt).toLocaleDateString()}` : ''}
                              >
                                <Trophy className="w-2.5 h-2.5 inline mr-1" />{b.title}
                              </span>
                            ))}
                            {badges.length > 3 && (
                              <button
                                onClick={() => setExpandedBadges((prev) => ({ ...prev, [e._id]: !showAllBadges }))}
                                className="text-xs text-brand hover:underline"
                              >
                                {showAllBadges ? 'Show less' : `+${badges.length - 3} more`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link
                          to={`/learning/courses/${e.course?._id}`}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          {e.progressPercent === 100 ? 'Review' : 'Continue'}
                        </Link>
                        {e.certified && e.course?._id && (
                          <Link
                            to={`/learning/courses/${e.course._id}/certificate`}
                            className="px-3 py-1.5 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors whitespace-nowrap text-center"
                          >
                            Certificate
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

export default MyLearning;
