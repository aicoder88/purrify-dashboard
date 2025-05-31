'use client';

import { startOfDay, endOfDay, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import * as React from 'react';
import { NewMainLayout } from '@/components/layout/new-main-layout';
import {
  EnhancedChart,
  EnhancedDateRangePicker,
  MultiSelectFilter,
  SocialMediaWidget,
  AnimatedMetricCard,
  ErrorBoundary,
  DashboardSkeleton,
  Button,
  DarkModeToggle,
  useTheme
} from '@/components/ui';
import { useDashboardData, useRefreshDashboard } from '@/hooks/use-dashboard-data';
import { useKeyboardShortcuts, createDefaultShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useRealTimeData } from '@/hooks/use-realtime-data';
import { FilterState, type SocialMediaWidget as SocialMediaWidgetType } from '@/types';

// Mock data for demonstration
const mockSocialData: SocialMediaWidgetType = {
  title: 'Recent Posts',
  totalEngagement: 15420,
  growthRate: 12.5,
  posts: [
    {
      id: '1',
      platform: 'instagram',
      content: '🐱 New Purrify Premium formula is here! Your cats will love the improved taste and nutrition. #PurrifyPremium #CatNutrition',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      engagement: { likes: 1250, comments: 89, shares: 45, views: 5600 },
      createdAt: new Date('2024-01-15'),
      url: 'https://instagram.com/purrify/post/1',
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Thank you to all our retail partners! Together we\'re making cats happier and healthier across Canada. 🇨🇦',
      engagement: { likes: 890, comments: 156, shares: 78 },
      createdAt: new Date('2024-01-14'),
      url: 'https://facebook.com/purrify/post/2',
    },
    {
      id: '3',
      platform: 'twitter',
      content: 'Did you know? 95% of cats prefer Purrify over other brands in taste tests! 📊 #CatFacts #PurrifyStats',
      engagement: { likes: 445, comments: 67, shares: 123, views: 2100 },
      createdAt: new Date('2024-01-13'),
      url: 'https://twitter.com/purrify/status/3',
    },
  ],
};

const regionOptions = [
  { value: 'bc', label: 'British Columbia', count: 45 },
  { value: 'ab', label: 'Alberta', count: 38 },
  { value: 'on', label: 'Ontario', count: 67 },
  { value: 'qc', label: 'Quebec', count: 52 },
  { value: 'mb', label: 'Manitoba', count: 23 },
  { value: 'sk', label: 'Saskatchewan', count: 19 },
];

const storeTypeOptions = [
  { value: 'pet-store', label: 'Pet Store', count: 89 },
  { value: 'veterinary', label: 'Veterinary Clinic', count: 67 },
  { value: 'farm-supply', label: 'Farm Supply', count: 34 },
  { value: 'grocery', label: 'Grocery Store', count: 23 },
  { value: 'online', label: 'Online Retailer', count: 31 },
];

const salesRepOptions = [
  { value: 'sarah-m', label: 'Sarah Mitchell', count: 45 },
  { value: 'john-d', label: 'John Davis', count: 38 },
  { value: 'emily-r', label: 'Emily Rodriguez', count: 52 },
  { value: 'michael-c', label: 'Michael Chen', count: 41 },
  { value: 'lisa-w', label: 'Lisa Wilson', count: 29 },
];

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

const ClearIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function EnhancedDashboardContent() {
  const { data, isLoading, error } = useDashboardData();
  const refreshMutation = useRefreshDashboard();
  const { toggleDarkMode } = useTheme();

  // Filter state
  const [filters, setFilters] = React.useState<FilterState>({
    dateRange: {
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    },
    regions: [],
    storeTypes: [],
    salesReps: [],
    searchQuery: '',
  });

  // Real-time data
  const handleRealTimeUpdate = React.useCallback((update: any) => {
    console.log('Real-time update:', update);
    // In a real app, you'd update your data based on the update type
  }, []);

  const { connection, lastUpdate } = useRealTimeData({
    onUpdate: handleRealTimeUpdate,
  });

  // Keyboard shortcuts
  const handleRefreshData = React.useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);

  const shortcuts = React.useMemo(() => createDefaultShortcuts({
    refreshData: handleRefreshData,
    toggleSidebar: () => console.log('Toggle sidebar'),
    openSearch: () => console.log('Open search'),
    exportData: () => console.log('Export data'),
    showHelp: () => console.log('Show help'),
    toggleDarkMode,
  }), [handleRefreshData, toggleDarkMode]);

  useKeyboardShortcuts({ shortcuts });

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      regions: [],
      storeTypes: [],
      salesReps: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.dateRange.from || 
    filters.regions.length > 0 || 
    filters.storeTypes.length > 0 || 
    filters.salesReps.length > 0 || 
    filters.searchQuery.length > 0;

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

  // Generate sample chart data
  const lineChartData = Array.from({ length: 30 }, (_, i) => ({
    x: `Day ${i + 1}`,
    y: Math.floor(Math.random() * 1000) + 500,
    label: `Day ${i + 1}`,
  }));

  const pieChartData = [
    { x: 'Pet Stores', y: 45, label: 'Pet Stores' },
    { x: 'Veterinary', y: 30, label: 'Veterinary' },
    { x: 'Farm Supply', y: 15, label: 'Farm Supply' },
    { x: 'Other', y: 10, label: 'Other' },
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
          <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white">Enhanced Sales Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">
            Advanced analytics with real-time updates and interactive features.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${connection.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-neutral-600 dark:text-neutral-300">
              {connection.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
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
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <ClearIcon />
              <span className="ml-1">Clear All</span>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedDateRangePicker
            value={filters.dateRange}
            onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
            placeholder="Select date range"
          />
          
          <MultiSelectFilter
            options={regionOptions}
            value={filters.regions}
            onChange={(regions) => setFilters(prev => ({ ...prev, regions }))}
            placeholder="Select regions"
          />
          
          <MultiSelectFilter
            options={storeTypeOptions}
            value={filters.storeTypes}
            onChange={(storeTypes) => setFilters(prev => ({ ...prev, storeTypes }))}
            placeholder="Select store types"
          />
          
          <MultiSelectFilter
            options={salesRepOptions}
            value={filters.salesReps}
            onChange={(salesReps) => setFilters(prev => ({ ...prev, salesReps }))}
            placeholder="Select sales reps"
          />
        </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedChart
          data={lineChartData}
          type="line"
          title="Sales Trend (30 Days)"
          height={400}
          animated={true}
          exportable={true}
        />
        
        <EnhancedChart
          data={pieChartData}
          type="pie"
          title="Sales by Store Type"
          height={400}
          animated={true}
          exportable={true}
        />
      </div>

      {/* Social Media Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedChart
            data={lineChartData}
            type="area"
            title="Revenue Growth"
            height={300}
            animated={true}
            exportable={true}
          />
        </div>
        
        <SocialMediaWidget
          data={mockSocialData}
          loading={false}
        />
      </div>

      {/* Real-time Updates Info */}
      {lastUpdate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-sm text-teal-700 dark:text-teal-300">
              Last update: {lastUpdate.type} at {new Date(lastUpdate.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-neutral-500 dark:text-neutral-400"
      >
        <p>
          Press <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs">Ctrl+R</kbd> to refresh, 
          <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs ml-1">Ctrl+Shift+D</kbd> to toggle dark mode
        </p>
      </motion.div>
    </div>
  );
}

export default function EnhancedDashboardPage() {
  return (
    <NewMainLayout>
      <ErrorBoundary>
        <EnhancedDashboardContent />
      </ErrorBoundary>
    </NewMainLayout>
  );
}