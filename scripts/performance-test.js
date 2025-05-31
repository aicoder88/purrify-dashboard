#!/usr/bin/env node

/**
 * Performance Testing Script for Purrify Dashboard
 * Tests Core Web Vitals, load times, and other performance metrics
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  outputDir: 'performance-reports',
  testPages: [
    '/',
    '/login',
    '/dashboard',
    '/dashboard/enhanced',
    '/dashboard/mobile',
  ],
  viewport: {
    width: 1920,
    height: 1080,
  },
  mobileViewport: {
    width: 375,
    height: 667,
  },
  thresholds: {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
    loadTime: 3000,
  },
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

/**
 * Create output directory
 */
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
}

/**
 * Get Web Vitals metrics
 */
async function getWebVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {};
      
      // Import web-vitals library if available
      if (typeof webVitals !== 'undefined') {
        webVitals.getCLS((metric) => vitals.CLS = metric);
        webVitals.getFID((metric) => vitals.FID = metric);
        webVitals.getFCP((metric) => vitals.FCP = metric);
        webVitals.getLCP((metric) => vitals.LCP = metric);
        webVitals.getTTFB((metric) => vitals.TTFB = metric);
        
        setTimeout(() => resolve(vitals), 2000);
      } else {
        // Fallback to Performance API
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        vitals.TTFB = navigation.responseStart - navigation.requestStart;
        vitals.FCP = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        vitals.loadTime = navigation.loadEventEnd - navigation.navigationStart;
        
        resolve(vitals);
      }
    });
  });
}

/**
 * Test page performance
 */
async function testPagePerformance(browser, url, viewport = CONFIG.viewport) {
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport(viewport);
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    // Start performance measurement
    const startTime = Date.now();
    
    // Navigate to page
    const response = await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    
    const loadTime = Date.now() - startTime;
    
    // Get performance metrics
    const metrics = await page.metrics();
    const webVitals = await getWebVitals(page);
    
    // Get resource loading metrics
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        totalSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
        slowestResource: Math.max(...resources.map(r => r.duration)),
        averageResourceTime: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length,
      };
    });
    
    // Get JavaScript heap size
    const jsHeapSize = await page.evaluate(() => {
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      } : null;
    });
    
    // Take screenshot
    const screenshotPath = path.join(
      CONFIG.outputDir,
      `screenshot-${url.replace(/[^a-zA-Z0-9]/g, '_')}-${viewport.width}x${viewport.height}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    return {
      url,
      viewport,
      loadTime,
      responseStatus: response?.status(),
      metrics: {
        ...metrics,
        ...webVitals,
        ...resourceMetrics,
        jsHeapSize,
      },
      screenshot: screenshotPath,
      timestamp: new Date().toISOString(),
    };
    
  } catch (err) {
    error(`Failed to test ${url}: ${err.message}`);
    return {
      url,
      viewport,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await page.close();
  }
}

/**
 * Test accessibility
 */
async function testAccessibility(browser, url) {
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Inject axe-core for accessibility testing
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
    });
    
    // Run accessibility tests
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.axe.run((err, results) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });
    
    return results;
    
  } catch (err) {
    error(`Accessibility test failed for ${url}: ${err.message}`);
    return { error: err.message };
  } finally {
    await page.close();
  }
}

/**
 * Analyze results and generate report
 */
function analyzeResults(results) {
  const analysis = {
    summary: {
      totalPages: results.length,
      passedPages: 0,
      failedPages: 0,
      averageLoadTime: 0,
      issues: [],
    },
    details: results,
  };
  
  let totalLoadTime = 0;
  
  results.forEach((result) => {
    if (result.error) {
      analysis.summary.failedPages++;
      analysis.summary.issues.push(`${result.url}: ${result.error}`);
    } else {
      analysis.summary.passedPages++;
      totalLoadTime += result.loadTime;
      
      // Check against thresholds
      if (result.loadTime > CONFIG.thresholds.loadTime) {
        analysis.summary.issues.push(
          `${result.url}: Load time ${result.loadTime}ms exceeds threshold ${CONFIG.thresholds.loadTime}ms`
        );
      }
      
      if (result.metrics.FCP > CONFIG.thresholds.FCP) {
        analysis.summary.issues.push(
          `${result.url}: FCP ${result.metrics.FCP}ms exceeds threshold ${CONFIG.thresholds.FCP}ms`
        );
      }
      
      if (result.metrics.LCP > CONFIG.thresholds.LCP) {
        analysis.summary.issues.push(
          `${result.url}: LCP ${result.metrics.LCP}ms exceeds threshold ${CONFIG.thresholds.LCP}ms`
        );
      }
      
      if (result.metrics.CLS > CONFIG.thresholds.CLS) {
        analysis.summary.issues.push(
          `${result.url}: CLS ${result.metrics.CLS} exceeds threshold ${CONFIG.thresholds.CLS}`
        );
      }
    }
  });
  
  if (analysis.summary.passedPages > 0) {
    analysis.summary.averageLoadTime = totalLoadTime / analysis.summary.passedPages;
  }
  
  return analysis;
}

/**
 * Generate HTML report
 */
function generateHTMLReport(analysis) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Test Report - Purrify Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #1ABC9C; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #1ABC9C; }
        .metric-label { color: #666; margin-top: 5px; }
        .issues { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .issue { margin: 5px 0; color: #856404; }
        .results-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .results-table th, .results-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .results-table th { background: #f8f9fa; font-weight: 600; }
        .good { color: #27ae60; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
        .screenshot { max-width: 200px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Performance Test Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Base URL:</strong> ${CONFIG.baseUrl}</p>
        
        <h2>Summary</h2>
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${analysis.summary.totalPages}</div>
                <div class="metric-label">Total Pages</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analysis.summary.passedPages}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analysis.summary.failedPages}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${Math.round(analysis.summary.averageLoadTime)}ms</div>
                <div class="metric-label">Avg Load Time</div>
            </div>
        </div>
        
        ${analysis.summary.issues.length > 0 ? `
        <div class="issues">
            <h3>Issues Found</h3>
            ${analysis.summary.issues.map(issue => `<div class="issue">• ${issue}</div>`).join('')}
        </div>
        ` : '<div class="good">✓ No performance issues found!</div>'}
        
        <h2>Detailed Results</h2>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Page</th>
                    <th>Load Time</th>
                    <th>FCP</th>
                    <th>LCP</th>
                    <th>CLS</th>
                    <th>Resources</th>
                    <th>Screenshot</th>
                </tr>
            </thead>
            <tbody>
                ${analysis.details.map(result => `
                <tr>
                    <td>${result.url}</td>
                    <td class="${result.loadTime > CONFIG.thresholds.loadTime ? 'error' : 'good'}">
                        ${result.loadTime || 'N/A'}ms
                    </td>
                    <td class="${result.metrics?.FCP > CONFIG.thresholds.FCP ? 'error' : 'good'}">
                        ${result.metrics?.FCP || 'N/A'}ms
                    </td>
                    <td class="${result.metrics?.LCP > CONFIG.thresholds.LCP ? 'error' : 'good'}">
                        ${result.metrics?.LCP || 'N/A'}ms
                    </td>
                    <td class="${result.metrics?.CLS > CONFIG.thresholds.CLS ? 'error' : 'good'}">
                        ${result.metrics?.CLS || 'N/A'}
                    </td>
                    <td>${result.metrics?.totalResources || 'N/A'}</td>
                    <td>
                        ${result.screenshot ? `<img src="${path.basename(result.screenshot)}" class="screenshot" alt="Screenshot">` : 'N/A'}
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
  `;
  
  return html;
}

/**
 * Main test function
 */
async function runPerformanceTests() {
  info('Starting performance tests...');
  
  createOutputDir();
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const results = [];
  
  try {
    // Test desktop performance
    info('Testing desktop performance...');
    for (const page of CONFIG.testPages) {
      const url = `${CONFIG.baseUrl}${page}`;
      info(`Testing ${url}...`);
      const result = await testPagePerformance(browser, url, CONFIG.viewport);
      results.push(result);
    }
    
    // Test mobile performance
    info('Testing mobile performance...');
    for (const page of CONFIG.testPages) {
      const url = `${CONFIG.baseUrl}${page}`;
      info(`Testing ${url} (mobile)...`);
      const result = await testPagePerformance(browser, url, CONFIG.mobileViewport);
      result.url += ' (mobile)';
      results.push(result);
    }
    
    // Analyze results
    const analysis = analyzeResults(results);
    
    // Save JSON report
    const jsonReport = path.join(CONFIG.outputDir, 'performance-report.json');
    fs.writeFileSync(jsonReport, JSON.stringify(analysis, null, 2));
    
    // Generate HTML report
    const htmlReport = generateHTMLReport(analysis);
    const htmlReportPath = path.join(CONFIG.outputDir, 'performance-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport);
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    success('Performance tests completed!');
    info(`Total pages tested: ${analysis.summary.totalPages}`);
    info(`Passed: ${analysis.summary.passedPages}`);
    info(`Failed: ${analysis.summary.failedPages}`);
    info(`Average load time: ${Math.round(analysis.summary.averageLoadTime)}ms`);
    
    if (analysis.summary.issues.length > 0) {
      warning(`Found ${analysis.summary.issues.length} performance issues`);
    } else {
      success('No performance issues found!');
    }
    
    info(`Reports saved to: ${CONFIG.outputDir}/`);
    info(`HTML Report: ${htmlReportPath}`);
    info(`JSON Report: ${jsonReport}`);
    
    // Exit with appropriate code
    process.exit(analysis.summary.issues.length > 0 ? 1 : 0);
    
  } catch (err) {
    error(`Performance tests failed: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests if called directly
if (require.main === module) {
  runPerformanceTests().catch(console.error);
}

module.exports = { runPerformanceTests, CONFIG };