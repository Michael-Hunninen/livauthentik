'use client';

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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ActivityTrendsChartProps {
  className?: string;
}

const ActivityTrendsChart: React.FC<ActivityTrendsChartProps> = ({ className = '' }) => {
  // Sample data - in a real app, this would come from your API
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Workouts',
        data: [4, 8, 12, 10, 14, 16, 15],
        borderColor: 'rgb(17, 94, 89)', // teal-800
        backgroundColor: 'rgba(17, 94, 89, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(17, 94, 89)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Meals Logged',
        data: [8, 12, 10, 15, 18, 20, 22],
        borderColor: 'rgb(180, 83, 9)', // amber-800
        backgroundColor: 'rgba(180, 83, 9, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(180, 83, 9)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Mindfulness',
        data: [3, 5, 8, 6, 10, 12, 14],
        borderColor: 'rgb(75, 85, 99)', // gray-600
        backgroundColor: 'rgba(75, 85, 99, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(75, 85, 99)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          color: '#4B5563', // gray-600
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827', // gray-900
        bodyColor: '#4B5563', // gray-600
        borderColor: '#E5E7EB', // gray-200
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} ${context.dataset.label === 'Workouts' || context.dataset.label === 'Meals Logged' ? 'sessions' : 'minutes'}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280', // gray-500
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.03)',
        },
        ticks: {
          color: '#6B7280', // gray-500
          callback: function(value: any) {
            return Number.isInteger(value) ? value : '';
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  const chartOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      tooltip: {
        ...options.plugins.tooltip,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      } as any // Type assertion for boxShadow
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#4B5563', // gray-600
          padding: 12, // Add more padding for x-axis labels
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#4B5563' // gray-600
        }
      }
    }
  } as const; // Use const assertion for type safety

  return (
    <div className={`w-full h-full ${className} bg-transparent flex flex-col`}>
      <div className="flex justify-end mb-2">
        <select 
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white/50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-devotionBrown/50"
          defaultValue="last6"
        >
          <option value="last6">Last 6 Months</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <div className="h-[300px] md:h-[400px] lg:h-[450px] w-full">
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default ActivityTrendsChart;
