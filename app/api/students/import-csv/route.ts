import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import Papa from 'papaparse';
import { validateStudent } from '@/lib/utils';

const COLLECTION = 'social_media_addiction';
const BATCH_LIMIT = 500;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();

    const parseResult = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'CSV parsing error', details: parseResult.errors },
        { status: 400 }
      );
    }

    const rows = parseResult.data as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found in CSV' },
        { status: 400 }
      );
    }

    const validRecords: any[] = [];
    const errors: any[] = [];

    rows.forEach((row, index) => {
      const transformed = {
        Student_ID: parseInt(row.Student_ID) || 0,
        Age: parseInt(row.Age) || 0,
        Gender: (row.Gender || '').trim(),
        Academic_Level: (row.Academic_Level || '').trim(),
        Country: (row.Country || '').trim(),
        Avg_Daily_Usage_Hours: parseFloat(row.Avg_Daily_Usage_Hours) || 0,
        Most_Used_Platform: (row.Most_Used_Platform || '').trim(),
        Affects_Academic_Performance: (row.Affects_Academic_Performance || '').trim(),
        Sleep_Hours_Per_Night: parseFloat(row.Sleep_Hours_Per_Night) || 0,
        Mental_Health_Score: parseInt(row.Mental_Health_Score) || 0,
        Relationship_Status: (row.Relationship_Status || '').trim(),
        Conflicts_Over_Social_Media: parseInt(row.Conflicts_Over_Social_Media) || 0,
        Addicted_Score: parseInt(row.Addicted_Score) || 0,
      };

      const validation = validateStudent(transformed);

      if (validation.valid) {
        validRecords.push(transformed);
      } else {
        errors.push({ row: index + 2, data: row, errors: validation.errors });
      }
    });

    if (validRecords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid records found in CSV', validationErrors: errors },
        { status: 400 }
      );
    }

    const baseTimestamp = new Date();

    for (let i = 0; i < validRecords.length; i += BATCH_LIMIT) {
      const chunk = validRecords.slice(i, i + BATCH_LIMIT);
      const batch = db.batch();
      chunk.forEach((record, idx) => {
        const docRef = db.collection(COLLECTION).doc();
        const timestamp = new Date(baseTimestamp.getTime() + i + idx);
        batch.set(docRef, { ...record, createdAt: timestamp.toISOString() });
      });
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${validRecords.length} records`,
      imported: validRecords.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error importing CSV:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

