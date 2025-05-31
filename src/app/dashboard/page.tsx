'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import {
  AnimatedMetricCard,
  DashboardChart,
  ErrorBoundary,
  DashboardSkeleton,
  Button
} from '@/components/ui';
import { useDashboardData, useRefreshDashboard } from '@/hooks/use-dashboard-data';

// Icons for the metrics
const StoreIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SampleIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const PurchaseIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const RepeatIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

function DashboardContent() {
  const { data, isLoading, error } = useDashboardData();
  const refreshMutation = useRefreshDashboard();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Stores Contacted',
      value: data.metrics.totalStoresContacted.value,
      change: data.metrics.totalStoresContacted.change,
      icon: <StoreIcon />,
    },
    {
      title: 'Samples Given',
      value: data.metrics.samplesGiven.value,
      change: data.metrics.samplesGiven.change,
      icon: <SampleIcon />,
    },
    {
      title: 'Stores That Bought Once',
      value: data.metrics.storesBoughtOnce.value,
      change: data.metrics.storesBoughtOnce.change,
      icon: <PurchaseIcon />,
    },
    {
      title: 'Stores That Bought More Than Once',
      value: data.metrics.storesBoughtMoreThanOnce.value,
      change: data.metrics.storesBoughtMoreThanOnce.change,
      icon: <RepeatIcon />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Sales Dashboard</h1>
          <p className="text-neutral-600 mt-2">
            Track your Purrify sales performance and customer engagement metrics.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleRefresh}
            disabled={refreshMutation.isPending}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <motion.div
              animate={refreshMutation.isPending ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: refreshMutation.isPending ? Infinity : 0 }}
            >
              <RefreshIcon />
            </motion.div>
            <span className="ml-2">
              {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <AnimatedMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            animationDelay={index * 100}
          />
        ))}
      </div>

      {/* Chart Section */}
      <DashboardChart
        data={data.chartData}
        title="Sales Performance Overview"
        height={400}
      />

      {/* Data Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-neutral-500"
      >
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <MainLayout>
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </MainLayout>
  );
}