'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { MobileChart } from '@/components/mobile/mobile-chart';
import { MobileDatePicker } from '@/components/mobile/mobile-date-picker';
import { useHapticFeedback } from '@/hooks/use-mobile-gestures';

// Sample chart data
const salesData = [
  { x: 1, y: 1200, label: 'Jan', value: 1200 },
  { x: 2, y: 1800, label: 'Feb', value: 1800 },
  { x: 3, y: 1600, label: 'Mar', value: 1600 },
  { x: 4, y: 2200, label: 'Apr', value: 2200 },
  { x: 5, y: 2800, label: 'May', value: 2800 },
  { x: 6, y: 3200, label: 'Jun', value: 3200 },
];

const revenueData = [
  { x: 1, y: 15000, label: 'Week 1', value: 15000 },
  { x: 2, y: 18000, label: 'Week 2', value: 18000 },
  { x: 3, y: 22000, label: 'Week 3', value: 22000 },
  { x: 4, y: 25000, label: 'Week 4', value: 25000 },
];

const MetricCard = ({ title, value, change, icon }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) => {
  const { lightImpact } = useHapticFeedback();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onTap={() => lightImpact()}
    >
      <Card className="p-4 glass border-glass-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-teal-400">{change}</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function MobileDashboardPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedDataPoint, setSelectedDataPoint] = React.useState<any>(null);
  const { mediumImpact } = useHapticFeedback();

  const handleDataPointTap = (point: any) => {
    setSelectedDataPoint(point);
    mediumImpact();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Mobile Dashboard
          </h1>
          <p className="text-white/70">
            Touch-optimized analytics with gestures
          </p>
        </motion.div>

        {/* Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MobileDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select date range"
          />
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <MetricCard
            title="Total Sales"
            value="$12.4K"
            change="+12.5% from last month"
            icon={
              <svg className="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          
          <MetricCard
            title="Orders"
            value="1,234"
            change="+8.2% from last week"
            icon={
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
          
          <MetricCard
            title="Customers"
            value="892"
            change="+15.3% from last month"
            icon={
              <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          
          <MetricCard
            title="Conversion"
            value="3.2%"
            change="+0.8% from last week"
            icon={
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </motion.div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 glass border-glass-border">
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Sales Trend
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Tap points for details • Pinch to zoom • Swipe to pan
            </p>
            <MobileChart
              data={salesData}
              width={300}
              height={200}
              onDataPointTap={handleDataPointTap}
              enablePinchZoom
              enablePan
            />
            {selectedDataPoint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="text-sm text-white">
                  <span className="font-medium">{selectedDataPoint.label}:</span>{' '}
                  <span className="text-teal-400">${selectedDataPoint.value.toLocaleString()}</span>
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 glass border-glass-border">
            <h3 className="text-lg font-semibold text-white mb-4">
              Weekly Revenue
            </h3>
            <MobileChart
              data={revenueData}
              width={300}
              height={150}
              onDataPointTap={handleDataPointTap}
              enablePinchZoom={false}
              enablePan={false}
            />
          </Card>
        </motion.div>

        {/* Mobile Features Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 glass border-glass-border">
            <h3 className="text-lg font-semibold text-white mb-4">
              Mobile Features
            </h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                <span>Pull down to refresh data</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Swipe navigation drawer from left</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Haptic feedback on interactions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Touch-optimized charts and controls</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span>PWA installation and offline support</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Installation Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 glass border-glass-border bg-gradient-to-br from-teal-500/10 to-blue-500/10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 flex items-center justify-center">
                <svg className="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Install as App
              </h3>
              <p className="text-sm text-white/70 mb-4">
                Add to your home screen for the best mobile experience
              </p>
              <button className="btn btn-primary">
                Install App
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}