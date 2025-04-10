import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/backend/utils/mongodb";
import userModel from "@/app/backend/models/user.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  await connectDB();
  const address = params.address?.toLowerCase();

  try {
    if (!address) {
      return NextResponse.json({ success: false, message: "Address is required" });
    }

    const user = await userModel.findOne({ address });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, applicationStatus: user.status });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}
