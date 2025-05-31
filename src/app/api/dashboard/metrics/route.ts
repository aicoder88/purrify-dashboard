import { NextRequest, NextResponse } from 'next/server';

// Dummy data as specified in the requirements
const dashboardMetrics = {
  totalStoresContacted: {
    value: 36,
    change: {
      value: 8.3,
      type: 'increase' as const,
      period: 'vs last month',
    },
  },
  samplesGiven: {
    value: 120,
    change: {
      value: 15.2,
      type: 'increase' as const,
      period: 'vs last month',
    },
  },
  storesBoughtOnce: {
    value: 10,
    change: {
      value: 25.0,
      type: 'increase' as const,
      period: 'vs last month',
    },
  },
  storesBoughtMoreThanOnce: {
    value: 4,
    change: {
      value: 33.3,
      type: 'increase' as const,
      period: 'vs last month',
    },
  },
};

// Chart data for the bar chart
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Stores Contacted',
      data: [12, 19, 15, 25, 22, 36],
      backgroundColor: '#1ABC9C',
      borderColor: '#1ABC9C',
      borderWidth: 1,
    },
    {
      label: 'Samples Given',
      data: [28, 45, 38, 62, 55, 120],
      backgroundColor: '#27AE60',
      borderColor: '#27AE60',
      borderWidth: 1,
    },
    {
      label: 'Stores That Bought',
      data: [3, 5, 4, 8, 6, 10],
      backgroundColor: '#E67E22',
      borderColor: '#E67E22',
      borderWidth: 1,
    },
  ],
};

export async function GET(_request: NextRequest) {
  try {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = {
      metrics: dashboardMetrics,
      chartData,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}

// POST endpoint for real-time updates simulation
export async function POST(request: NextRequest) {
  try {
    await request.json();
    
    // Simulate real-time data update
    const updatedMetrics = {
      ...dashboardMetrics,
      // Add some random variation to simulate real-time changes
      totalStoresContacted: {
        ...dashboardMetrics.totalStoresContacted,
        value: dashboardMetrics.totalStoresContacted.value + Math.floor(Math.random() * 3),
      },
      samplesGiven: {
        ...dashboardMetrics.samplesGiven,
        value: dashboardMetrics.samplesGiven.value + Math.floor(Math.random() * 5),
      },
    };

    return NextResponse.json({
      metrics: updatedMetrics,
      chartData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to update dashboard metrics' },
      { status: 500 }
    );
  }
}