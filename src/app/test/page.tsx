'use client';

import * as React from 'react';
import { NewMainLayout } from '@/components/layout/new-main-layout';
import { VibrantButton } from '@/components/ui/vibrant-button';
import { VibrantMetricCard } from '@/components/ui/vibrant-metric-card';

const TestIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function TestPage() {
  return (
    <NewMainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dark Mode Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This page tests the dark mode functionality and layout without authentication.
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VibrantMetricCard
            title="Test Metric 1"
            value="1,234"
            change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
            icon={<TestIcon />}
            variant="blue"
          />
          <VibrantMetricCard
            title="Test Metric 2"
            value="5,678"
            change={{ value: 8.3, type: 'increase', period: 'vs last week' }}
            icon={<TestIcon />}
            variant="green"
          />
          <VibrantMetricCard
            title="Test Metric 3"
            value="9,012"
            change={{ value: 3.2, type: 'decrease', period: 'vs last month' }}
            icon={<TestIcon />}
            variant="pink"
          />
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Button Tests
          </h2>
          <div className="flex flex-wrap gap-4">
            <VibrantButton variant="primary">Primary Button</VibrantButton>
            <VibrantButton variant="secondary">Secondary Button</VibrantButton>
            <VibrantButton variant="outline">Outline Button</VibrantButton>
          </div>
        </div>

        {/* Test Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Dark Mode Content Test
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This content should change colors based on the dark mode setting. 
            The background should be white in light mode and dark gray in dark mode.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Secondary text should also adapt to the theme.
          </p>
        </div>
      </div>
    </NewMainLayout>
  );
}