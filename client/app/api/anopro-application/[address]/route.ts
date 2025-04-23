import userModel from "@/app/backend/models/user.model";
import connectDB from "@/app/backend/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface ApplicationData {
  address: string;
  alias: string;
  email: string;
  specialty: string;
  region: string;
  message: string;
  experience: string;
  credentials: string;
  licenseIssuer: string;
  licenseFile?: {
    cid: string;
    key: string;
  };
  nationalIdFile?: {
    cid: string;
    key: string;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  await connectDB();

  const body: ApplicationData = await req.json();
  const address = body.address || params.address;
  if (!address) {
    return NextResponse.json(
      { success: false, message: "Missing address parameter" },
      { status: 400 }
    );
  }

  try {
    const { licenseFile, nationalIdFile, ...applicationData } = body;

    if (
      !licenseFile?.cid || !licenseFile?.key ||
      !nationalIdFile?.cid || !nationalIdFile?.key
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required files" },
        { status: 400 }
      );
    }

    const existing = await userModel.findOne({ address });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Application already exists" },
        { status: 409 }
      );
    }

    await userModel.create({
      ...applicationData,
      address,
      licenseFile,
      nationalIdFile,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: applicationData }, { status: 201 });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
