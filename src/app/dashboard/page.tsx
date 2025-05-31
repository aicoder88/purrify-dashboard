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

// Enhanced Icons with modern styling
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

const SparkleIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full glass flex items-center justify-center">
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-white/60 font-medium">No data available</p>
          <p className="text-white/40 text-sm">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Stores Contacted',
      value: data.metrics.totalStoresContacted.value,
      change: data.metrics.totalStoresContacted.change,
      icon: <StoreIcon />,
      variant: 'primary' as const,
    },
    {
      title: 'Samples Given',
      value: data.metrics.samplesGiven.value,
      change: data.metrics.samplesGiven.change,
      icon: <SampleIcon />,
      variant: 'secondary' as const,
    },
    {
      title: 'Stores That Bought Once',
      value: data.metrics.storesBoughtOnce.value,
      change: data.metrics.storesBoughtOnce.change,
      icon: <PurchaseIcon />,
      variant: 'success' as const,
    },
    {
      title: 'Stores That Bought More Than Once',
      value: data.metrics.storesBoughtMoreThanOnce.value,
      change: data.metrics.storesBoughtMoreThanOnce.change,
      icon: <RepeatIcon />,
      variant: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl animate-float" />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="glass-card p-8 border-2 border-white/10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                  <SparkleIcon />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gradient">
                    Purrify Sales Dashboard
                  </h1>
                  <p className="text-white/70 text-lg font-medium mt-1">
                    Track your sales performance and customer engagement metrics in real-time
                  </p>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
                variant="primary"
                size="lg"
                className="group relative overflow-hidden"
              >
                <motion.div
                  animate={refreshMutation.isPending ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ 
                    duration: 1, 
                    repeat: refreshMutation.isPending ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="mr-3"
                >
                  <RefreshIcon />
                </motion.div>
                <span className="font-semibold">
                  {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
                </span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-500/10 to-success-500/10 rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.5 + (index * 0.1), 
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <AnimatedMetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              variant={metric.variant}
              animationDelay={index * 100}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-card p-6 border border-white/10"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gradient mb-2">
            Sales Performance Overview
          </h2>
          <p className="text-white/60">
            Comprehensive view of your sales trends and performance metrics
          </p>
        </div>
        
        <DashboardChart
          data={data.chartData}
          title="Sales Performance Overview"
          height={400}
        />
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="glass-card p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white/90 font-semibold">Last Updated</p>
              <p className="text-white/60 text-sm">
                {new Date(data.lastUpdated).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-success-400">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
        </div>
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