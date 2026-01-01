import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCSVFile, CSVRowSchema } from '@/lib/validation';

interface ParsedCSVRow {
  storeName: string;
  location: string;
  status: string;
  salesRep: string;
  date: string;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file with helper
    const fileValidation = validateCSVFile(file as File);
    if (!fileValidation.success) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Read the CSV file
    const text = await file!.text();
    const rows = text.split('\n').map((row) => row.split(','));

    // Skip header row
    const headers = rows[0];
    const dataRows = rows.slice(1).filter((row) => row.length > 1);

    // Parse and validate each row
    const parsedData: ParsedCSVRow[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    dataRows.forEach((row, index) => {
      const rowData = {
        storeName: row[0]?.trim() || '',
        location: row[1]?.trim() || '',
        status: row[2]?.trim() || '',
        salesRep: row[3]?.trim() || '',
        date: row[4]?.trim() || '',
        notes: row[5]?.trim() || '',
      };

      const validation = CSVRowSchema.safeParse(rowData);
      if (validation.success) {
        parsedData.push(validation.data as ParsedCSVRow);
      } else {
        errors.push({
          row: index + 2, // +2 for header and 0-index
          error: validation.error.issues.map((e: z.ZodIssue) => e.message).join(', '),
        });
      }
    });

    // Filter out empty rows
    const validData = parsedData.filter((item) => item.storeName);

    // TODO: Store this data in your database
    console.log('Parsed CSV data:', validData);
    console.log(`Imported ${validData.length} rows`);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${validData.length} rows`,
      data: validData,
      headers: headers,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process CSV file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Enable CORS for this endpoint
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
