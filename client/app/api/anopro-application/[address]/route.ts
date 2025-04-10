import userModel from "@/app/backend/models/user.model";
import connectDB from "@/app/backend/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

// POST /api/anopro-application/[address]
export async function POST(req: NextRequest, { params }: { params: { address: string } }) {
  await connectDB();
  const body = await req.json();
  const address = params.address?.toLowerCase();

  const {
    alias,
    specialty,
    region,
    message,
    experience,
    credentials,
    licenseIssuer,
    licenseFile,
    nationalIdFile,
    email,
  } = body;

  try {
    const existing = await userModel.findOne({ address });
    if (existing) {
      return NextResponse.json({ success: false, message: "Application already exists" });
    }

    const saved = await userModel.create({
      address,
      alias,
      specialty,
      region,
      message,
      experience,
      credentials,
      licenseIssuer,
      licenseFile,
      nationalIdFile,
      email
    });

    console.log(saved)

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}
