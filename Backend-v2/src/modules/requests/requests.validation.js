import { z } from 'zod';
import { REQUEST_STATUSES, URGENCIES, LIMITS } from '../../config/constants.js';
import { title, description, category } from '../../utils/fields.js';
import { idParams } from '../../utils/objectId.js';

const urgency = z.enum(URGENCIES, 'Urgency must be low, medium or high');
const status = z.enum(REQUEST_STATUSES, 'Invalid status');
const tags = z
  .array(z.string().trim().min(1).max(LIMITS.tags.each, `Tags must be at most ${LIMITS.tags.each} characters`))
  .max(LIMITS.tags.max, `At most ${LIMITS.tags.max} tags`);

export const createRequestSchema = z.object({
  title,
  description,
  category,
  urgency: urgency.default('medium'),
  tags: tags.default([]),
});

export const updateRequestSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    category: category.optional(),
    urgency: urgency.optional(),
    status: status.optional(),
    tags: tags.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to update' });

export const listByUserQuery = z.object({ tag: z.string().trim().max(LIMITS.tags.each).optional() });
export const requestIdParams = idParams('id');
export const requesterIdParams = idParams('userId');
