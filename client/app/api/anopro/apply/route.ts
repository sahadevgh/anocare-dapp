import applicationModel from "@/app/backend/models/application.model";
import connectDB from "@/app/backend/utils/mongodb";
import { NextResponse } from "next/server";

// Controller function to handle the application submission
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const existing = await applicationModel.findOne({ address: body.address });
    if (existing) {
      return NextResponse.json({ success: false, message: "Application already exists" });
    }

    console.log("Received application data:", body);

    // Validate required fields
    // const saved = await applicationModel.create({
    //   address: body.address,
    //   alias: body.alias,
    //   specialty: body.specialty,
    //   region: body.region,
    //   message: body.message,
    //   experience: body.experience,
    //   credentials: body.credentials,
    //   licenseIssuer: body.licenseIssuer,
    //   licenseCID: body.licenseCID,
    //   licenseKey: body.licenseKey,
    //   nationalIdCID: body.nationalIdCID,
    //   nationalIdKey: body.nationalIdKey,
    // });

    // return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}
