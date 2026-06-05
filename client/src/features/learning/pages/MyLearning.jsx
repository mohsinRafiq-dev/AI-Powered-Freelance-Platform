import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, BookOpen, Trophy, GraduationCap } from 'lucide-react';
import { getMyProgress } from '@/api/learningApi';
import { InlineLoader } from '../../../components/common/Loader';
import { Badge } from '../../../components/ui/badge';

const MyLearning = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProgress();
        setData(res?.data || res);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><InlineLoader text="Loading progress" /></div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-brand" /> My Learning
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Track your progress, badges, and certifications.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatBox label="Enrolled" value={data?.stats?.total || 0} />
          <StatBox label="Completed" value={data?.stats?.completed || 0} />
          <StatBox label="Certificates" value={data?.stats?.certificates || 0} icon={<Award className="w-4 h-4 text-yellow-500" />} />
          <StatBox label="Badges" value={data?.stats?.badges || 0} icon={<Trophy className="w-4 h-4 text-yellow-500" />} />
        </div>

        {data?.certificates?.length ? (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-yellow-500" /> Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certificates.map((c) => (
                <div key={c.certificateCode} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-white dark:bg-gray-800">Certified</Badge>
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{c.course?.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Score: {c.bestScore}% · {new Date(c.certifiedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs font-mono mt-2 bg-white dark:bg-gray-800 inline-block px-2 py-1 rounded">{c.certificateCode}</p>
                  <Link
                    to={'/learning/courses/' + c.course?._id + '/certificate'}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg"
                  >
                    <Award className="w-3.5 h-3.5" /> View Certificate
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="text-brand" /> My Courses</h2>
          {!data?.enrollments?.length ? (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
              <Link to="/learning" className="inline-block px-4 py-2 bg-brand text-white rounded">Browse Learning Hub</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.enrollments.map((e) => (
                <Link
                  key={e._id}
                  to={`/learning/courses/${e.course?._id}`}
                  className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{e.course?.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{e.course?.category}</Badge>
                        <Badge variant="secondary" className="text-xs capitalize">{e.course?.level}</Badge>
                        {e.certified ? <Badge variant="success" className="text-xs">Certified</Badge> : null}
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded">
                        <div className="h-full bg-brand rounded" style={{ width: `${e.progressPercent}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{e.progressPercent}% complete · best score {e.bestScore}%</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {(e.badges || []).slice(0, 3).map((b) => (
                        <span key={b.code} className="text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">{b.title}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
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

export default MyLearning;
