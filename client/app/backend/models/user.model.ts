import { Schema, model, models } from "mongoose";

const FileSchema = new Schema({
  cid: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
}, { _id: false });

const UserSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  alias: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    required: true
  },
  credentials: {
    type: String,
    required: true
  },
  licenseIssuer: {
    type: String,
    required: true
  },
  licenseFile: {
    type: FileSchema,
    required: true
  },
  nationalIdFile: {
    type: FileSchema,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;