import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the CSV file
    const text = await file.text();
    const rows = text.split('\n').map(row => row.split(','));

    // Skip header row
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length > 1);

    // Expected columns (customize based on your Google Sheet structure):
    // Store Name, Location, Status, Sales Rep, Date, Notes
    const parsedData = data.map(row => ({
      storeName: row[0]?.trim() || '',
      location: row[1]?.trim() || '',
      status: row[2]?.trim() || '',
      salesRep: row[3]?.trim() || '',
      date: row[4]?.trim() || '',
      notes: row[5]?.trim() || '',
    })).filter(item => item.storeName); // Filter out empty rows

    // TODO: Store this data in your database
    // For now, we'll just log it and return success
    console.log('Parsed CSV data:', parsedData);
    console.log(`Imported ${parsedData.length} rows`);

    // In a real app, you would:
    // 1. Validate the data
    // 2. Store in a database (PostgreSQL, MongoDB, etc.)
    // 3. Update the dashboard metrics

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${parsedData.length} rows`,
      data: parsedData,
      headers: headers,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Enable CORS for this endpoint
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
