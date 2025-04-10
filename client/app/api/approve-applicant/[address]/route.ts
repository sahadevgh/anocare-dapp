import { NextResponse } from 'next/server';
import connectDB from '@/app/backend/utils/mongodb';
import applicationModel from '@/app/backend/models/user.model';

// Approve an applicant with a given address
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { address } = body;

    // Check if the applicant exists
    const applicant = await applicationModel.findOne({ address });
    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
    }

    // Update the applicant's status to approved
    applicant.status = 'approved';
    await applicant.save();

    return NextResponse.json({ success: true, message: 'Applicant approved successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
    console.error('An unexpected error occurred:', err);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
