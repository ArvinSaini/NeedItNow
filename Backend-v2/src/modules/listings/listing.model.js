import mongoose from 'mongoose';
import { CATEGORIES, LISTING_TYPES, LISTING_STATUSES, LIMITS } from '../../config/constants.js';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: LIMITS.title.max },
    description: { type: String, required: true, trim: true, maxlength: LIMITS.description.max },
    category: { type: String, required: true, enum: CATEGORIES },
    images: { type: [String], default: [] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    type: { type: String, enum: LISTING_TYPES, required: true },
    price: { type: Number, default: 0, min: 0, max: LIMITS.price.max },
    status: { type: String, enum: LISTING_STATUSES, default: 'available' },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

export const Listing = mongoose.model('listing', listingSchema);
