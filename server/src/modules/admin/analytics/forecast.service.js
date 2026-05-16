import User from '../../../models/User.js';
import Job from '../../../models/Job.js';
import Transaction from '../../../models/Transaction.js';

/**
 * Trend forecasting service.
 *
 * Approach: simple OLS linear regression on aggregated daily time series,
 * extended with optional 7-day moving average smoothing. This is a
 * deliberately lightweight ML technique — appropriate for a marketplace
 * with months (not years) of data, and far cheaper to run than a full
 * time-series model while still giving directional insight (skill demand
 * up/down, revenue trajectory, user growth).
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const buildBuckets = (rows, days, valueKey = 'count') => {
  // rows: [{ _id: 'YYYY-MM-DD', count: n }] -> dense array of length `days`
  const map = new Map(rows.map((r) => [r._id, r[valueKey] || 0]));
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * ONE_DAY_MS);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, value: map.get(key) || 0 });
  }
  return out;
};

const linearRegression = (series) => {
  // series: [{date, value}] -> slope/intercept on x=index, y=value
  const n = series.length;
  if (n < 2) return { slope: 0, intercept: series[0]?.value || 0, r2: 0 };

  const xs = series.map((_, i) => i);
  const ys = series.map((p) => p.value);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0; let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  // R^2
  let ssTot = 0; let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = slope * xs[i] + intercept;
    ssRes += (ys[i] - yPred) ** 2;
    ssTot += (ys[i] - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { slope, intercept, r2 };
};

const forecast = (series, horizonDays) => {
  const { slope, intercept, r2 } = linearRegression(series);
  const future = [];
  const startIdx = series.length;
  const startDate = new Date(series[series.length - 1].date);
  for (let h = 1; h <= horizonDays; h++) {
    const idx = startIdx + h - 1;
    const value = Math.max(0, slope * idx + intercept);
    const d = new Date(startDate.getTime() + h * ONE_DAY_MS);
    future.push({ date: d.toISOString().slice(0, 10), value: Math.round(value * 100) / 100, predicted: true });
  }
  return { history: series, forecast: future, slope, r2, trend: slope > 0.1 ? 'up' : slope < -0.1 ? 'down' : 'flat' };
};

class ForecastService {
  async forecastUserGrowth({ lookbackDays = 60, horizonDays = 14 } = {}) {
    const since = new Date(Date.now() - lookbackDays * ONE_DAY_MS);
    const rows = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    const series = buildBuckets(rows, lookbackDays);
    return forecast(series, horizonDays);
  }

  async forecastRevenue({ lookbackDays = 60, horizonDays = 14 } = {}) {
    const since = new Date(Date.now() - lookbackDays * ONE_DAY_MS);
    const rows = await Transaction.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $in: ['completed', 'COMPLETED', 'success'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: '$amount' },
        },
      },
    ]);
    const series = buildBuckets(rows, lookbackDays);
    return forecast(series, horizonDays);
  }

  async forecastJobPostings({ lookbackDays = 60, horizonDays = 14 } = {}) {
    const since = new Date(Date.now() - lookbackDays * ONE_DAY_MS);
    const rows = await Job.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    const series = buildBuckets(rows, lookbackDays);
    return forecast(series, horizonDays);
  }

  /**
   * Skill demand analysis: how often each skill appears on jobs over time.
   */
  async skillDemandTrends({ lookbackDays = 90, topN = 15 } = {}) {
    const since = new Date(Date.now() - lookbackDays * ONE_DAY_MS);
    const rows = await Job.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 },
          firstSeen: { $min: '$createdAt' },
          lastSeen: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: topN },
    ]);

    const halfPoint = new Date(Date.now() - (lookbackDays / 2) * ONE_DAY_MS);
    const enriched = await Promise.all(
      rows.map(async (r) => {
        const [recent, older] = await Promise.all([
          Job.countDocuments({ skills: r._id, createdAt: { $gte: halfPoint } }),
          Job.countDocuments({ skills: r._id, createdAt: { $gte: since, $lt: halfPoint } }),
        ]);
        const change = older === 0 ? (recent > 0 ? 1 : 0) : (recent - older) / older;
        return {
          skill: r._id,
          totalPostings: r.count,
          recentHalf: recent,
          olderHalf: older,
          changeRatio: Math.round(change * 100) / 100,
          trend: change > 0.1 ? 'rising' : change < -0.1 ? 'falling' : 'stable',
        };
      })
    );
    return enriched;
  }
}

export default new ForecastService();
