import { NextResponse } from 'next/server';
import connectDB from '../../backend/utils/mongodb';
import applicationModel from '../../backend/models/application.model';
import cloudinary from '@/app/backend/utils/cloudinary';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { address, alias, file } = body;

    console.log('Received data:', body);

    const existingApplicant = await applicationModel.findOne({ address });
    if (existingApplicant) {
      return NextResponse.json({ success: false, error: 'Applicant already registered' }, { status: 400 });
    }

    const existingAlias = await applicationModel.findOne({ alias });
    if (existingAlias) {
      return NextResponse.json({ success: false, error: 'Alias already taken' }, { status: 400 });
    }

    let licenseData = null;
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file, {
        folder: "anocare/applications",
        resource_type: "auto",
      });

      licenseData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const appData = {
      ...body,
      address,
      alias,
      license: licenseData,
    };

    const app = await applicationModel.create(appData);

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
