import mongoose from 'mongoose';
import { LIMITS, ROLES } from '../../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: LIMITS.name.max },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: LIMITS.email.max },
    // select:false → never returned unless a query explicitly asks with .select('+password')
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    hostel: { type: String, required: true, trim: true, maxlength: LIMITS.hostel.max },
    roomNumber: { type: String, trim: true, maxlength: LIMITS.roomNumber.max },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, enum: ROLES, default: 'user' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Model name 'user' keeps the legacy collection name 'users', so existing data works unchanged.
export const User = mongoose.model('user', userSchema);
