import mongoose from 'mongoose';
import { CATEGORIES, REQUEST_STATUSES, URGENCIES, LIMITS } from '../../config/constants.js';

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: LIMITS.title.max },
    description: { type: String, required: true, trim: true, maxlength: LIMITS.description.max },
    category: { type: String, required: true, enum: CATEGORIES },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    urgency: { type: String, enum: URGENCIES, default: 'medium' },
    status: { type: String, enum: REQUEST_STATUSES, default: 'active' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

requestSchema.index({ status: 1, createdAt: -1 });

// Named ItemRequest to avoid shadowing Node's global Request. Model name 'request' keeps the legacy collection.
export const ItemRequest = mongoose.model('request', requestSchema);
