import { NextResponse } from 'next/server';
import connectDB from '../../backend/utils/mongodb';
import applicationModel from '../../backend/models/user.model';

export async function GET() {
  try {
    await connectDB();

// Get all applicants
    const applicants = await applicationModel.find({}).select('-__v -createdAt -updatedAt').lean();
    if (!applicants || applicants.length === 0) {
      return NextResponse.json({ success: false, error: 'No applicants found' }, { status: 404 });
    }

    if (!applicants) {
      return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, applicants });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
    console.error('An unexpected error occurred:', err);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}