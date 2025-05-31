import { NextRequest, NextResponse } from 'next/server';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: 'healthy' | 'unhealthy' | 'unknown';
    cache: 'healthy' | 'unhealthy' | 'unknown';
    memory: 'healthy' | 'unhealthy' | 'unknown';
    disk: 'healthy' | 'unhealthy' | 'unknown';
  };
  performance: {
    responseTime: number;
    memoryUsage?: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * Health check endpoint for monitoring and load balancers
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Basic health checks
    const checks = await performHealthChecks();
    
    // Memory usage (if available)
    const memoryUsage = getMemoryUsage();
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Determine overall status
    const isHealthy = Object.values(checks).every(check => check === 'healthy');
    
    const healthResponse: HealthCheckResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks,
      performance: {
        responseTime,
        ...(memoryUsage && { memoryUsage }),
      },
    };

    // Return appropriate status code
    const statusCode = isHealthy ? 200 : 503;
    
    return NextResponse.json(healthResponse, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        database: 'unknown',
        cache: 'unknown',
        memory: 'unknown',
        disk: 'unknown',
      },
      performance: {
        responseTime: Date.now() - startTime,
      },
    };
    
    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

/**
 * Perform various health checks
 */
async function performHealthChecks() {
  const checks: {
    database: 'healthy' | 'unhealthy' | 'unknown';
    cache: 'healthy' | 'unhealthy' | 'unknown';
    memory: 'healthy' | 'unhealthy' | 'unknown';
    disk: 'healthy' | 'unhealthy' | 'unknown';
  } = {
    database: 'unknown',
    cache: 'unknown',
    memory: 'unknown',
    disk: 'unknown',
  };

  // Database health check
  try {
    // In a real application, you would check your database connection here
    // For now, we'll simulate a successful check
    checks.database = 'healthy';
  } catch (error) {
    console.error('Database health check failed:', error);
    checks.database = 'unhealthy';
  }

  // Cache health check
  try {
    // In a real application, you would check your cache (Redis, etc.) here
    // For now, we'll simulate a successful check
    checks.cache = 'healthy';
  } catch (error) {
    console.error('Cache health check failed:', error);
    checks.cache = 'unhealthy';
  }

  // Memory health check
  try {
    const memoryUsage = getMemoryUsage();
    if (memoryUsage && memoryUsage.percentage < 90) {
      checks.memory = 'healthy';
    } else {
      checks.memory = 'unhealthy';
    }
  } catch (error) {
    console.error('Memory health check failed:', error);
    checks.memory = 'unhealthy';
  }

  // Disk health check
  try {
    // In a real application, you would check disk space here
    // For now, we'll simulate a successful check
    checks.disk = 'healthy';
  } catch (error) {
    console.error('Disk health check failed:', error);
    checks.disk = 'unhealthy';
  }

  return checks;
}

/**
 * Get memory usage information
 */
function getMemoryUsage() {
  try {
    const usage = process.memoryUsage();
    const totalMemory = usage.heapTotal + usage.external;
    const usedMemory = usage.heapUsed;
    
    return {
      used: Math.round(usedMemory / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: Math.round((usedMemory / totalMemory) * 100),
    };
  } catch (error) {
    console.error('Failed to get memory usage:', error);
    return null;
  }
}

/**
 * Detailed health check endpoint (for internal monitoring)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { includeDetails = false } = body;

    if (!includeDetails) {
      return GET(request);
    }

    // Extended health check with more details
    const startTime = Date.now();
    const checks = await performHealthChecks();
    const memoryUsage = getMemoryUsage();
    
    const detailedResponse = {
      status: Object.values(checks).every(check => check === 'healthy') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks,
      performance: {
        responseTime: Date.now() - startTime,
        memoryUsage,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        cwd: process.cwd(),
      },
      features: {
        pwa: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
        analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
        errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
      },
    };

    return NextResponse.json(detailedResponse, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Detailed health check failed:', error);
    return NextResponse.json(
      { error: 'Health check failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}