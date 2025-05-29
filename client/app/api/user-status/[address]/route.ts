import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/backend/utils/mongodb";
import userModel from "@/app/backend/models/user.model";

// This controller is used to change the status of a user between active and inactive
export async function PUT(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  await connectDB();
  const address = params.address?.toLowerCase();

  try {
    if (!address) {
      return NextResponse.json({ success: false, message: "Address is required" });
    }

    const user = await userModel.findOne({ address }).select("-__v -updatedAt");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error changing user status:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}
