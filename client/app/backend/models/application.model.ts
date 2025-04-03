import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
    },
    specialty: String,
    region: String,
    message: String,
    experience: String,
    credentials: String,
    licenseIssuer: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    license: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

export default models.Application || model("Application", ApplicationSchema);
