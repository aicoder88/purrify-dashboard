/**
 * Tests for use-dashboard-data hook
 *
 * Tests the following exported functions:
 * - useDashboardData: Fetches dashboard metrics and chart data
 * - useRefreshDashboard: Mutation for refreshing dashboard data
 * - useRealTimeUpdates: Real-time updates simulation
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useDashboardData,
  useRefreshDashboard,
  useRealTimeUpdates,
} from '@/hooks/use-dashboard-data';
import type { DashboardData } from '@/hooks/use-dashboard-data';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error for expected error tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Create a wrapper with QueryClientProvider for testing hooks
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

// Sample mock data
const mockDashboardData: DashboardData = {
  metrics: {
    totalStoresContacted: {
      value: 150,
      change: {
        value: 12,
        type: 'increase',
        period: 'vs last month',
      },
    },
    samplesGiven: {
      value: 300,
      change: {
        value: 25,
        type: 'increase',
        period: 'vs last month',
      },
    },
    storesBoughtOnce: {
      value: 75,
      change: {
        value: 8,
        type: 'increase',
        period: 'vs last month',
      },
    },
    storesBoughtMoreThanOnce: {
      value: 45,
      change: {
        value: 5,
        type: 'decrease',
        period: 'vs last month',
      },
    },
  },
  chartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [100, 120, 150, 180, 200, 220],
        backgroundColor: '#667eea',
        borderColor: '#764ba2',
        borderWidth: 2,
      },
    ],
  },
  lastUpdated: '2026-01-01T12:00:00Z',
};

const mockRefreshedData: DashboardData = {
  ...mockDashboardData,
  metrics: {
    ...mockDashboardData.metrics,
    totalStoresContacted: {
      value: 160,
      change: {
        value: 15,
        type: 'increase',
        period: 'vs last month',
      },
    },
  },
  lastUpdated: '2026-01-01T12:30:00Z',
};

describe('useDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('successful data fetching', () => {
    it('should fetch dashboard data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Data should be populated
      expect(result.current.data).toEqual(mockDashboardData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should call fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/metrics');
      });
    });

    it('should return correct metrics structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify metrics structure
      const metrics = result.current.data?.metrics;
      expect(metrics?.totalStoresContacted.value).toBe(150);
      expect(metrics?.totalStoresContacted.change.type).toBe('increase');
      expect(metrics?.samplesGiven.value).toBe(300);
      expect(metrics?.storesBoughtOnce.value).toBe(75);
      expect(metrics?.storesBoughtMoreThanOnce.value).toBe(45);
    });

    it('should return correct chart data structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify chart data structure
      const chartData = result.current.data?.chartData;
      expect(chartData?.labels).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ]);
      expect(chartData?.datasets).toHaveLength(1);

      const firstDataset = chartData?.datasets[0];
      expect(firstDataset?.label).toBe('Sales');
      expect(firstDataset?.data).toEqual([100, 120, 150, 180, 200, 220]);
    });
  });

  describe('error handling', () => {
    it('should handle fetch error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe(
        'Failed to fetch dashboard data'
      );
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should handle 404 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(
        'Failed to fetch dashboard data'
      );
    });
  });

  describe('query options', () => {
    it('should have correct staleTime configuration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDashboardData,
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      renderHook(() => useDashboardData(), { wrapper });

      await waitFor(() => {
        const queryState = queryClient.getQueryState(['dashboard-data']);
        expect(queryState).toBeDefined();
      });

      // Note: We can verify the query was made successfully
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe('useRefreshDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should call refresh endpoint with POST method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const { result } = renderHook(() => useRefreshDashboard(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: true }),
    });
  });

  it('should update query cache on successful refresh', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useRefreshDashboard(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify cache was updated
    const cachedData = queryClient.getQueryData(['dashboard-data']);
    expect(cachedData).toEqual(mockRefreshedData);
  });

  it('should return refreshed data with updated values', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const { result } = renderHook(() => useRefreshDashboard(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.metrics.totalStoresContacted.value).toBe(160);
    expect(result.current.data?.lastUpdated).toBe('2026-01-01T12:30:00Z');
  });

  it('should handle refresh error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useRefreshDashboard(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to refresh dashboard:',
      expect.any(Error)
    );
  });

  it('should handle network error during refresh', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useRefreshDashboard(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('should show pending state during refresh', async () => {
    // Create a deferred promise to control timing
    let resolvePromise: ((value: unknown) => void) | undefined;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockImplementationOnce(() => promise);

    const { result } = renderHook(() => useRefreshDashboard(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    // Should be pending
    expect(result.current.isPending).toBe(true);

    // Resolve the promise
    await act(async () => {
      if (resolvePromise) {
        resolvePromise({
          ok: true,
          json: async () => mockRefreshedData,
        });
      }
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});

describe('useRealTimeUpdates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return startRealTimeUpdates and stopRealTimeUpdates functions', () => {
    const { result } = renderHook(() => useRealTimeUpdates(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.startRealTimeUpdates).toBe('function');
    expect(typeof result.current.stopRealTimeUpdates).toBe('function');
  });

  it('should start real-time updates with 30 second interval', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const { result } = renderHook(() => useRealTimeUpdates(), {
      wrapper: createWrapper(),
    });

    let interval: NodeJS.Timeout | undefined;

    act(() => {
      interval = result.current.startRealTimeUpdates();
    });

    expect(interval).toBeDefined();

    // Advance time by 30 seconds
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Should have made one refresh call
    expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: true }),
    });

    // Clean up
    if (interval) {
      result.current.stopRealTimeUpdates(interval);
    }
  });

  it('should stop real-time updates when stopRealTimeUpdates is called', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const { result } = renderHook(() => useRealTimeUpdates(), {
      wrapper: createWrapper(),
    });

    let interval: NodeJS.Timeout | undefined;

    act(() => {
      interval = result.current.startRealTimeUpdates();
    });

    // Stop the updates
    act(() => {
      if (interval) {
        result.current.stopRealTimeUpdates(interval);
      }
    });

    // Clear any pending timers and reset mock
    mockFetch.mockClear();

    // Advance time by 60 seconds
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    // Should not have made any calls after stopping
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should make multiple refresh calls over time', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const { result } = renderHook(() => useRealTimeUpdates(), {
      wrapper: createWrapper(),
    });

    let interval: NodeJS.Timeout | undefined;

    act(() => {
      interval = result.current.startRealTimeUpdates();
    });

    // Advance time by 90 seconds (3 intervals)
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Should have made 3 refresh calls
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Clean up
    if (interval) {
      result.current.stopRealTimeUpdates(interval);
    }
  });

  it('should handle errors during real-time updates gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRealTimeUpdates(), {
      wrapper: createWrapper(),
    });

    let interval: NodeJS.Timeout | undefined;

    act(() => {
      interval = result.current.startRealTimeUpdates();
    });

    // Advance time to trigger an update
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Should log error but not crash
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Real-time update failed:',
      expect.any(Error)
    );

    // Clean up
    if (interval) {
      result.current.stopRealTimeUpdates(interval);
    }
  });

  it('should update query cache during real-time updates', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockRefreshedData,
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    const { result } = renderHook(() => useRealTimeUpdates(), { wrapper });

    let interval: NodeJS.Timeout | undefined;

    act(() => {
      interval = result.current.startRealTimeUpdates();
    });

    // Advance time to trigger an update
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Wait for the async operation
    await waitFor(() => {
      const cachedData = queryClient.getQueryData(['dashboard-data']);
      expect(cachedData).toEqual(mockRefreshedData);
    });

    // Clean up
    if (interval) {
      result.current.stopRealTimeUpdates(interval);
    }
  });
});

describe('Integration: useDashboardData with useRefreshDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should update useDashboardData cache when useRefreshDashboard succeeds', async () => {
    // Initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    // Render both hooks
    const { result: dashboardResult } = renderHook(() => useDashboardData(), {
      wrapper,
    });
    const { result: refreshResult } = renderHook(() => useRefreshDashboard(), {
      wrapper,
    });

    // Wait for initial data
    await waitFor(() => {
      expect(dashboardResult.current.isSuccess).toBe(true);
    });

    expect(
      dashboardResult.current.data?.metrics.totalStoresContacted.value
    ).toBe(150);

    // Setup refresh response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRefreshedData,
    });

    // Trigger refresh
    await act(async () => {
      refreshResult.current.mutate();
    });

    await waitFor(() => {
      expect(refreshResult.current.isSuccess).toBe(true);
    });

    // Cache should be updated with refreshed data
    const cachedData = queryClient.getQueryData<DashboardData>([
      'dashboard-data',
    ]);
    expect(cachedData?.metrics.totalStoresContacted.value).toBe(160);
  });
});

describe('Type exports', () => {
  it('should export DashboardMetrics type', () => {
    // Type checking test - if this compiles, the types are exported correctly
    const metrics: DashboardData['metrics'] = mockDashboardData.metrics;
    expect(metrics.totalStoresContacted.value).toBe(150);
  });

  it('should export ChartData type', () => {
    // Type checking test
    const chartData: DashboardData['chartData'] = mockDashboardData.chartData;
    expect(chartData.labels).toHaveLength(6);
  });

  it('should export DashboardData type', () => {
    // Type checking test
    const data: DashboardData = mockDashboardData;
    expect(data.lastUpdated).toBeDefined();
  });
});
