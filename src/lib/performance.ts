/**
 * Performance monitoring utilities for Core Web Vitals and custom metrics
 */

import React from 'react';

// Global gtag function type
declare global {
  function gtag(...args: any[]): void;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface WebVitalsMetric extends PerformanceMetric {
  id: string;
  delta: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

/**
 * Get performance rating based on metric value and thresholds
 */
function getRating(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to analytics service
 */
function sendToAnalytics(metric: PerformanceMetric) {
  // Send to Google Analytics 4 if available
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
    });
  }
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  const performanceMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name as keyof typeof THRESHOLDS, metric.value),
    timestamp: Date.now(),
  };
  
  sendToAnalytics(performanceMetric);
}

/**
 * Measure custom performance metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Start measuring a custom metric
   */
  startMeasure(name: string): void {
    this.metrics.set(name, performance.now());
  }
  
  /**
   * End measuring and report a custom metric
   */
  endMeasure(name: string): number | null {
    const startTime = this.metrics.get(name);
    if (!startTime) return null;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    
    const metric: PerformanceMetric = {
      name,
      value: duration,
      rating: duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor',
      timestamp: Date.now(),
    };
    
    sendToAnalytics(metric);
    return duration;
  }
  
  /**
   * Measure component render time
   */
  measureComponentRender<T>(name: string, fn: () => T): T {
    this.startMeasure(`component_render_${name}`);
    const result = fn();
    this.endMeasure(`component_render_${name}`);
    return result;
  }
  
  /**
   * Measure API call duration
   */
  async measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    this.startMeasure(`api_call_${name}`);
    try {
      const result = await apiCall();
      this.endMeasure(`api_call_${name}`);
      return result;
    } catch (error) {
      this.endMeasure(`api_call_${name}`);
      throw error;
    }
  }
}

/**
 * Memory usage monitoring
 */
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined' || !('memory' in performance)) return;
  
  const memory = (performance as any).memory;
  const memoryMetric: PerformanceMetric = {
    name: 'memory_usage',
    value: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
    rating: memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8 ? 'poor' : 'good',
    timestamp: Date.now(),
  };
  
  sendToAnalytics(memoryMetric);
}

/**
 * Monitor long tasks that block the main thread
 */
export function monitorLongTasks(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: PerformanceMetric = {
          name: 'long_task',
          value: entry.duration,
          rating: entry.duration > 50 ? 'poor' : 'good',
          timestamp: Date.now(),
        };
        sendToAnalytics(metric);
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task monitoring not supported:', error);
  }
}

/**
 * Monitor layout shifts
 */
export function monitorLayoutShifts(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const metric: PerformanceMetric = {
            name: 'layout_shift',
            value: (entry as any).value,
            rating: getRating('CLS', (entry as any).value),
            timestamp: Date.now(),
          };
          sendToAnalytics(metric);
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('Layout shift monitoring not supported:', error);
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  // Monitor memory usage every 30 seconds
  setInterval(monitorMemoryUsage, 30000);
  
  // Monitor long tasks
  monitorLongTasks();
  
  // Monitor layout shifts
  monitorLayoutShifts();
  
  // Monitor resource loading
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = [
          { name: 'dns_lookup', value: navigation.domainLookupEnd - navigation.domainLookupStart },
          { name: 'tcp_connect', value: navigation.connectEnd - navigation.connectStart },
          { name: 'request_response', value: navigation.responseEnd - navigation.requestStart },
          { name: 'dom_parse', value: navigation.domContentLoadedEventEnd - navigation.responseEnd },
        ];
        
        metrics.forEach(metric => {
          const performanceMetric: PerformanceMetric = {
            name: metric.name,
            value: metric.value,
            rating: metric.value < 100 ? 'good' : metric.value < 300 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          };
          sendToAnalytics(performanceMetric);
        });
      }
    }, 0);
  });
}

/**
 * Performance-aware component wrapper
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    React.useEffect(() => {
      const monitor = PerformanceMonitor.getInstance();
      monitor.startMeasure(`${componentName}_mount`);
      return () => {
        monitor.endMeasure(`${componentName}_mount`);
      };
    }, []);

    return React.createElement(Component, props);
  };
}