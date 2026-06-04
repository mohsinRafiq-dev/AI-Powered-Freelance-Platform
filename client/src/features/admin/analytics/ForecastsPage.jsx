import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import {
  getUserGrowthForecast,
  getRevenueForecast,
  getJobPostingsForecast,
  getSkillDemandTrends,
} from '../../../api/admin/analyticsApi';
import ForecastChart from './ForecastChart';
import { InlineLoader } from '../../../components/common/Loader';

const trendBadge = (trend) => {
  if (trend === 'rising' || trend === 'up') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (trend === 'falling' || trend === 'down') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
};

const trendIcon = (trend) => {
  if (trend === 'rising' || trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
  if (trend === 'falling' || trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
};

const ForecastsPage = () => {
  const [horizon, setHorizon] = useState(14);
  const [lookback, setLookback] = useState(60);
  const [users, setUsers] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, r, j, s] = await Promise.all([
        getUserGrowthForecast(horizon, lookback).catch(() => null),
        getRevenueForecast(horizon, lookback).catch(() => null),
        getJobPostingsForecast(horizon, lookback).catch(() => null),
        getSkillDemandTrends(90, 20).catch(() => null),
      ]);
      setUsers(u?.data?.forecast || u?.forecast || null);
      setRevenue(r?.data?.forecast || r?.forecast || null);
      setJobs(j?.data?.forecast || j?.forecast || null);
      setSkills(s?.data?.trends || s?.trends || []);
    } catch (err) {
      console.error('Forecasts fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand" /> ML Forecasting & Skill Demand
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Linear-regression projections over historical activity. Use these to plan capacity and identify rising skill trends.
          </p>
        </div>
        <div className="flex items-end gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Lookback days</label>
            <input
              type="number"
              min="14"
              max="180"
              value={lookback}
              onChange={(e) => setLookback(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Forecast horizon</label>
            <input
              type="number"
              min="1"
              max="60"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <button
            onClick={fetchAll}
            className="px-4 py-2 rounded bg-brand text-white text-sm font-medium"
          >
            Recompute
          </button>
        </div>
      </div>

      {loading ? (
        <InlineLoader text="Computing forecasts" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <ForecastChart title="User Growth" color="rgb(99, 102, 241)" forecast={users} />
            <ForecastChart title="Revenue" color="rgb(34, 197, 94)" forecast={revenue} />
            <ForecastChart title="Job Postings" color="rgb(234, 88, 12)" forecast={jobs} />
          </div>

          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" /> Skill Demand Trends
              </h2>
              <p className="text-xs text-gray-500">Last 90 days · Top {skills.length}</p>
            </div>

            {skills.length === 0 ? (
              <p className="text-sm text-gray-500">No skill data in the lookback window.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="py-2">Skill</th>
                      <th className="py-2 text-right">Total postings</th>
                      <th className="py-2 text-right">Recent half</th>
                      <th className="py-2 text-right">Older half</th>
                      <th className="py-2 text-right">Change</th>
                      <th className="py-2 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((s) => (
                      <tr key={s.skill} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="py-2 font-medium">{s.skill}</td>
                        <td className="py-2 text-right">{s.totalPostings}</td>
                        <td className="py-2 text-right">{s.recentHalf}</td>
                        <td className="py-2 text-right">{s.olderHalf}</td>
                        <td className="py-2 text-right">{(s.changeRatio * 100).toFixed(0)}%</td>
                        <td className="py-2 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${trendBadge(s.trend)}`}>
                            {trendIcon(s.trend)} {s.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ForecastsPage;
