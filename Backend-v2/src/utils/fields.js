// Shared content-field schemas reused by both listings and requests, since the two modules
// validate the same title/description/category shape.
import { z } from 'zod';
import { CATEGORIES, LIMITS } from '../config/constants.js';

export const title = z
  .string()
  .trim()
  .min(LIMITS.title.min, `Title must be at least ${LIMITS.title.min} characters`)
  .max(LIMITS.title.max, `Title must be at most ${LIMITS.title.max} characters`);

export const description = z
  .string()
  .trim()
  .min(LIMITS.description.min, `Description must be at least ${LIMITS.description.min} characters`)
  .max(LIMITS.description.max, `Description must be at most ${LIMITS.description.max} characters`);

export const category = z.enum(CATEGORIES, 'Invalid category');
