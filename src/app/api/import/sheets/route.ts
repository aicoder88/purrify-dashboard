import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsImportSchema, validateInput } from '@/lib/validation';

/**
 * Processed row structure after normalization
 */
interface ProcessedRow {
  storeName: string;
  location: string;
  status: string;
  salesRep: string;
  date: string;
  notes: string;
}

/**
 * API endpoint to receive data from Google Sheets via Apps Script
 * This endpoint will be called automatically when your Google Sheet is updated
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the incoming data with Zod
    const validation = validateInput(GoogleSheetsImportSchema, data);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: 'Invalid data format', details: validation.errors },
        { status: 400 }
      );
    }

    const { rows } = validation.data;
    console.log(`Received ${rows.length} rows from Google Sheets`);

    // Process the data with proper typing
    const processedData: ProcessedRow[] = rows
      .map((row: Record<string, unknown>) => ({
        storeName: String(row.storeName || row['Store Name'] || ''),
        location: String(row.location || row.Location || ''),
        status: String(row.status || row.Status || ''),
        salesRep: String(row.salesRep || row['Sales Rep'] || ''),
        date: String(row.date || row.Date || ''),
        notes: String(row.notes || row.Notes || ''),
      }))
      .filter((item: ProcessedRow) => item.storeName); // Filter out empty rows

    // Calculate metrics from the data
    const metrics = {
      totalStoresContacted: processedData.length,
      samplesGiven: processedData.filter((r) =>
        r.status?.toLowerCase().includes('sample')
      ).length,
      storesBoughtOnce: processedData.filter(
        (r) =>
          r.status?.toLowerCase().includes('first purchase') ||
          r.status?.toLowerCase().includes('bought once')
      ).length,
      storesBoughtMoreThanOnce: processedData.filter(
        (r) =>
          r.status?.toLowerCase().includes('repeat') ||
          r.status?.toLowerCase().includes('more than once')
      ).length,
    };

    // TODO: Store this data in your database
    // For now, we'll store it in memory or a JSON file
    // In production, use PostgreSQL, MongoDB, or your preferred database

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
        details: error instanceof Error ? error.message : 'Unknown error',
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
          notes: 'Follow up next week',
        },
      ],
    },
  });
}

// Enable CORS for this endpoint (allows Google Apps Script to call it)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
