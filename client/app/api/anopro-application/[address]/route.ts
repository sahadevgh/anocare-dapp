// app/api/anopro-application/[address]/route.ts
import userModel from "@/app/backend/models/user.model";
import connectDB from "@/app/backend/utils/mongodb";
import { NextResponse } from "next/server";

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
  req: Request,
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

    // Validate required files
    if (
      (!licenseFile?.cid && !licenseFile?.key) ||
      (!nationalIdFile?.cid && !nationalIdFile?.key)
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required files" },
        { status: 400 }
      );
    }

    // Check for existing application
    const existing = await userModel.findOne({ address });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Application already exists" },
        { status: 409 }
      );
    }

    console.log("Application data:", applicationData);
    console.log("License file:", licenseFile);
    console.log("National ID file:", nationalIdFile);
    // Create application document
    await userModel.create({
      ...applicationData,
      licenseFile: {
        cid: licenseFile.cid,
        key: licenseFile.key,
      },
      nationalIdFile: {
        cid: nationalIdFile.cid,
        key: nationalIdFile.key,
      },
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
