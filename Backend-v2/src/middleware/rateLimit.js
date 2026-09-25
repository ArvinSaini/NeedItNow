import { rateLimit } from 'express-rate-limit';
import { config } from '../config/env.js';

const common = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  skip: () => config.NODE_ENV === 'test',
};

/** Whole API: 300 requests per 15 minutes per IP. */
export const globalLimiter = rateLimit({ ...common, limit: 300 });

/** Login, signup, password change: 20 per 15 minutes per IP (brute-force protection). */
export const authLimiter = rateLimit({ ...common, limit: 20 });
