import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const trendIcon = (trend) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

/**
 * Renders a forecast chart with two line series:
 *  - Historical (solid)
 *  - Forecast (dashed)
 *
 * Props:
 *  - title
 *  - color (CSS color, e.g. 'rgb(99, 102, 241)')
 *  - forecast: { history: [{date, value}], forecast: [{date, value}], slope, r2, trend }
 */
const ForecastChart = ({ title, color = 'rgb(99, 102, 241)', forecast }) => {
  if (!forecast) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-64 flex items-center justify-center text-sm text-gray-500">
        No forecast data
      </div>
    );
  }

  const allPoints = [...(forecast.history || []), ...(forecast.forecast || [])];
  const labels = allPoints.map((p) => p.date.slice(5)); // MM-DD
  const historyLen = forecast.history.length;

  // History dataset: values from history then null
  const historyValues = allPoints.map((p, i) => (i < historyLen ? p.value : null));
  // Forecast dataset: nulls then values, but include the last history point to connect the line
  const forecastValues = allPoints.map((p, i) => {
    if (i === historyLen - 1) return p.value;
    if (i >= historyLen) return p.value;
    return null;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Historical',
        data: historyValues,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.12)'),
        tension: 0.25,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Forecast',
        data: forecastValues,
        borderColor: color,
        backgroundColor: 'transparent',
        borderDash: [6, 6],
        tension: 0.25,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {trendIcon(forecast.trend)} <span className="uppercase">{forecast.trend}</span>
          <span>·</span>
          <span>R² = {(forecast.r2 || 0).toFixed(2)}</span>
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Linear-regression projection over {forecast.forecast?.length || 0} days. Dashed line = predicted values.
      </p>
    </div>
  );
};

export default ForecastChart;
