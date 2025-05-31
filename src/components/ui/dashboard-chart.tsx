'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { motion } from 'framer-motion';
import * as React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

interface DashboardChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  options?: any;
  className?: string;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  data,
  options,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-card text-card-foreground rounded-lg shadow-sm p-4 ${className}`}
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
};
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartProps {
  data: any;
  title?: string;
  height?: number;
  loading?: boolean;
  className?: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  data,
  title = "Sales Performance",
  height = 300,
  loading = false,
  className = "",
}) => {
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: '#2B2B2B',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#1ABC9C',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          color: '#6B7280',
          callback: function(value) {
            return typeof value === 'number' ? value.toString() : value;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card hover>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="flex items-center justify-center bg-neutral-50 rounded-lg animate-pulse"
              style={{ height: `${height}px` }}
            >
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-neutral-500 text-sm">Loading chart...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <Card hover className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-charcoal-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ height: `${height}px` }}
            className="relative"
          >
            <Bar data={data} options={chartOptions} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { DashboardChart };