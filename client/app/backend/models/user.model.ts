import { Schema, model, models } from "mongoose";

const FileSchema = new Schema({
  cid: {
    type: String,
    required: true, // IPFS CID of the encrypted file
  },
  key: {
    type: String, // Encrypted symmetric key (Base64 or JWK)
    required: true,
  }
}, { _id: false });

const UserSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true
    },
    alias: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
    },
    region: {
      type: String,
    },
    message: {
      type: String,
    },
    experience: {
      type: String,
    },
    credentials: {
      type: String,
    },
    licenseIssuer: {
      type: String,
    },
    licenseFile: {
      type: FileSchema,
    },
    nationalIdFile: {
      type: FileSchema,
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

// Export the model
const userModel = models.User || model("User", UserSchema);
export default userModel;