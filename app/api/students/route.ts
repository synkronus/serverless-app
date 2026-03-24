import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Student } from '@/lib/types';
import { validateStudent } from '@/lib/utils';

const COLLECTION = 'social_media_addiction';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const platform = searchParams.get('platform');
    const academicLevel = searchParams.get('academicLevel');

    let query = db.collection(COLLECTION);

    if (country) {
      query = query.where('Country', '==', country) as any;
    }
    if (platform) {
      query = query.where('Most_Used_Platform', '==', platform) as any;
    }
    if (academicLevel) {
      query = query.where('Academic_Level', '==', academicLevel) as any;
    }

    const snapshot = await query.get();
    let students: Student[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));

    students.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    if (search) {
      const searchLower = search.toLowerCase();
      const searchNum = parseInt(search);
      students = students.filter(student =>
        (!isNaN(searchNum) && student.Student_ID === searchNum) ||
        student.Country.toLowerCase().includes(searchLower) ||
        student.Most_Used_Platform.toLowerCase().includes(searchLower) ||
        student.Gender.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error: any) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const validation = validateStudent(data);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { id, ...studentData } = data;

    const studentWithTimestamp = {
      ...studentData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection(COLLECTION).add(studentWithTimestamp);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...studentData
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

