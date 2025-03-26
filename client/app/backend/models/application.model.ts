import { Schema, model, models } from 'mongoose';

const ApplicationSchema = new Schema(
  {
    address: String,
    alias: String,
    specialty: String,
    region: String,
    message: String,
    licenseUrl: String, // optional file/IPFS
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    }
  },
  { timestamps: true }
);

export default models.Application || model('Application', ApplicationSchema);
