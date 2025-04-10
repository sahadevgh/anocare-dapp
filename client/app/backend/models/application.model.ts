import { Schema, model, models } from "mongoose";

const FileSchema = new Schema({
  data: {
    type: Buffer,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  iv: { // Initialization Vector for AES-GCM
    type: Buffer,
    required: true
  }
}, { _id: false });

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
    specialty: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    credentials: {
      type: String,
      required: true,
    },
    licenseIssuer: {
      type: String,
      required: true,
    },
    licenseFile: {
      type: FileSchema,
      required: true,
    },
    nationalIdFile: {
      type: FileSchema,
      required: true,
    },
    encryptionKeys: {
      licenseKey: {
        type: String, // JWK format
        required: true
      },
      nationalIdKey: {
        type: String, // JWK format
        required: true
      }
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
ApplicationSchema.index({ address: 1 });
ApplicationSchema.index({ alias: 1 });
ApplicationSchema.index({ status: 1 });

export default models.Application || model("Application", ApplicationSchema);