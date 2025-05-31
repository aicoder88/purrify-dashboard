'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DashboardMetrics {
  totalStoresContacted: {
    value: number;
    change: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  };
  samplesGiven: {
    value: number;
    change: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  };
  storesBoughtOnce: {
    value: number;
    change: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  };
  storesBoughtMoreThanOnce: {
    value: number;
    change: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }>;
}

interface DashboardData {
  metrics: DashboardMetrics;
  chartData: ChartData;
  lastUpdated: string;
}

// Fetch dashboard data
async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard/metrics');
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  
  return response.json();
}

// Refresh dashboard data
async function refreshDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: true }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to refresh dashboard data');
  }
  
  return response.json();
}

// Hook for fetching dashboard data
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

// Hook for refreshing dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: refreshDashboardData,
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData(['dashboard-data'], data);
    },
    onError: (error) => {
      console.error('Failed to refresh dashboard:', error);
    },
  });
}

// Hook for real-time updates simulation
export function useRealTimeUpdates() {
  const queryClient = useQueryClient();
  
  const startRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const data = await refreshDashboardData();
        queryClient.setQueryData(['dashboard-data'], data);
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 30000); // Update every 30 seconds
    
    return interval;
  };
  
  const stopRealTimeUpdates = (interval: NodeJS.Timeout) => {
    clearInterval(interval);
  };
  
  return { startRealTimeUpdates, stopRealTimeUpdates };
}

// Export types for use in components
export type { DashboardMetrics, ChartData, DashboardData };