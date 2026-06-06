import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ data = [] }) => {
  const labels = data.map(item => {
    const date = new Date(item._id.year, item._id.month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  // Server returns `revenue` and `platformFee` (singular) - not totalRevenue/platformFees
  const revenueData = data.map(item => item.revenue || item.totalRevenue || 0);
  const platformFeesData = data.map(item => item.platformFee || item.platformFees || 0);
  const jobCountData = data.map(item => item.jobCount || item.count || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Revenue (Rs.)',
        data: revenueData,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Platform Fees (Rs.)',
        data: platformFeesData,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        yAxisID: 'y'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          afterBody: function(context) {
            const index = context[0].dataIndex;
            return `Jobs Completed: ${jobCountData[index]}`;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-PK', {
                style: 'currency',
                currency: 'PKR'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rs. ' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
