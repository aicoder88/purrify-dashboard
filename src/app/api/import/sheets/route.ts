import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to receive data from Google Sheets via Apps Script
 * This endpoint will be called automatically when your Google Sheet is updated
 */

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the incoming data
    if (!data || !Array.isArray(data.rows)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected { rows: [...] }' },
        { status: 400 }
      );
    }

    const rows = data.rows;
    console.log(`Received ${rows.length} rows from Google Sheets`);

    // Process the data
    // Expected structure from Google Sheets:
    // Each row: {storeName, location, status, salesRep, date, notes, ...}
    const processedData = rows.map((row: any) => ({
      storeName: row.storeName || row['Store Name'] || '',
      location: row.location || row['Location'] || '',
      status: row.status || row['Status'] || '',
      salesRep: row.salesRep || row['Sales Rep'] || '',
      date: row.date || row['Date'] || '',
      notes: row.notes || row['Notes'] || '',
      // Add any additional fields from your sheet
    })).filter((item: any) => item.storeName); // Filter out empty rows

    // Calculate metrics from the data
    const metrics = {
      totalStoresContacted: processedData.length,
      samplesGiven: processedData.filter((r: any) =>
        r.status?.toLowerCase().includes('sample')
      ).length,
      storesBoughtOnce: processedData.filter((r: any) =>
        r.status?.toLowerCase().includes('first purchase') ||
        r.status?.toLowerCase().includes('bought once')
      ).length,
      storesBoughtMoreThanOnce: processedData.filter((r: any) =>
        r.status?.toLowerCase().includes('repeat') ||
        r.status?.toLowerCase().includes('more than once')
      ).length,
    };

    // TODO: Store this data in your database
    // For now, we'll store it in memory or a JSON file
    // In production, use PostgreSQL, MongoDB, or your preferred database

    // You could also cache this in Redis for real-time access
    console.log('Processed metrics:', metrics);
    console.log('Sample data:', processedData.slice(0, 3));

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${processedData.length} rows`,
      metrics: metrics,
      rowCount: processedData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process Google Sheets data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve current cached data
export async function GET(_request: NextRequest) {
  // TODO: Retrieve data from your database
  // This is a placeholder response
  return NextResponse.json({
    message: 'Use POST to sync data from Google Sheets',
    example: {
      rows: [
        {
          storeName: 'Example Pet Store',
          location: 'Vancouver, BC',
          status: 'Sample Delivered',
          salesRep: 'John Doe',
          date: '2024-01-15',
          notes: 'Follow up next week'
        }
      ]
    }
  });
}

// Enable CORS for this endpoint (allows Google Apps Script to call it)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
