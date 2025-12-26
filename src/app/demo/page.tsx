'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  GlowCard,
  FeatureCard
} from '@/components/ui/card';
import { Input, SearchInput, PasswordInput } from '@/components/ui/input';
import { MetricCard } from '@/components/ui/metric-card';

// Demo Icons
const ChartIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const TrendIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function DemoPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 p-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <SparkleIcon />
            </div>
            <h1 className="text-5xl font-bold text-gradient">
              Modern Glassmorphic Design
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the new elegant, clean, and engaging design system with beautiful glassmorphic effects, 
            modern gradients, and smooth animations.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gradient mb-6">Enhanced Metric Cards</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value="$124,563"
              change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
              icon={<RevenueIcon />}
            />
            <MetricCard
              title="Active Users"
              value="8,429"
              change={{ value: 8.2, type: 'increase', period: 'vs last week' }}
              icon={<UsersIcon />}
            />
            <MetricCard
              title="Conversion Rate"
              value="3.24%"
              change={{ value: 2.1, type: 'decrease', period: 'vs last month' }}
              icon={<TrendIcon />}
            />
            <MetricCard
              title="Growth Rate"
              value="24.8%"
              change={{ value: 15.3, type: 'increase', period: 'vs last quarter' }}
              icon={<ChartIcon />}
            />
          </div>
        </motion.div>

        {/* Button Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gradient mb-6">Modern Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="lg">Primary Button</Button>
            <Button variant="secondary" size="lg">Secondary Button</Button>
            <Button variant="accent" size="lg">Accent Button</Button>
            <Button variant="success" size="lg">Success Button</Button>
            <Button variant="warning" size="lg">Warning Button</Button>
            <Button variant="danger" size="lg">Danger Button</Button>
            <Button variant="ghost" size="lg">Ghost Button</Button>
            <Button variant="outline" size="lg">Outline Button</Button>
          </div>
        </motion.div>

        {/* Input Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gradient mb-6">Enhanced Input Fields</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl">
            <Input 
              label="Full Name" 
              placeholder="Enter your full name"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <SearchInput placeholder="Search anything..." />
            <PasswordInput 
              label="Password" 
              placeholder="Enter your password"
            />
          </div>
        </motion.div>

        {/* Card Variants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gradient mb-6">Glassmorphic Card Variants</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="glass" hover>
              <CardHeader>
                <CardTitle>Standard Glass Card</CardTitle>
                <CardDescription>
                  Beautiful glassmorphic effect with subtle transparency and blur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  This card demonstrates the standard glass effect with perfect balance of transparency and readability.
                </p>
              </CardContent>
            </Card>

            <GlowCard>
              <CardHeader>
                <CardTitle>Glow Card</CardTitle>
                <CardDescription>
                  Enhanced card with beautiful glow effects and animations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  This card features enhanced glow effects that respond to hover interactions.
                </p>
              </CardContent>
            </GlowCard>

            <FeatureCard>
              <CardHeader>
                <CardTitle>Feature Card</CardTitle>
                <CardDescription>
                  Special card variant for highlighting key features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Perfect for showcasing important features with enhanced visual appeal.
                </p>
              </CardContent>
            </FeatureCard>
          </div>
        </motion.div>

        {/* Typography Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-gradient mb-6">Modern Typography</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gradient">Heading 1 - Gradient Text</h1>
            <h2 className="text-3xl font-bold text-gradient-secondary">Heading 2 - Secondary Gradient</h2>
            <h3 className="text-2xl font-bold text-gradient-accent">Heading 3 - Accent Gradient</h3>
            <p className="text-lg text-white/90">
              Regular paragraph text with excellent readability and modern font styling.
            </p>
            <p className="text-white/70">
              Secondary text with reduced opacity for hierarchy and visual balance.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center py-8"
        >
          <div className="glass-card p-6 inline-block">
            <p className="text-white/80 font-medium">
              ✨ Modern Glassmorphic Design System ✨
            </p>
            <p className="text-white/60 text-sm mt-2">
              Elegant • Clean • Engaging • Beautiful
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}