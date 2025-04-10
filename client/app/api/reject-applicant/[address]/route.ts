import { NextResponse } from "next/server";
import connectDB from "../../../backend/utils/mongodb";
import applicationModel from "../../../backend/models/user.model";

// Reject an applicant with a given address
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Get the address from the request body
    const { address } = body;

    // Get the applicant from the database
    const applicant = await applicationModel.findOne({ address });

    // Check if the applicant exists
    if (!applicant) {
      return NextResponse.json(
        { success: false, error: "Applicant not found" },
        { status: 404 }
      );
    }

    // Update the applicant's status to rejected
    applicant.status = "rejected";
    await applicant.save();

    return NextResponse.json({
      success: true,
      message: "Applicant rejected successfully",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
    console.error("An unexpected error occurred:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
