import { NextResponse } from 'next/server';
import connectDB from '../../backend/utils/mongodb';
import applicationModel from '../../backend/models/application.model';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const app = await applicationModel.create(body);
    return NextResponse.json({ success: true, app });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
    console.error('An unexpected error occurred:', err);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
