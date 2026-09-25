import { z } from 'zod';
import { LISTING_TYPES, LISTING_STATUSES, LIMITS } from '../../config/constants.js';
import { title, description, category } from '../../utils/fields.js';
import { idParams } from '../../utils/objectId.js';

const type = z.enum(LISTING_TYPES, 'Type must be lend or sell');
const status = z.enum(LISTING_STATUSES, 'Invalid status');
const price = z.coerce
  .number()
  .min(0, 'Price cannot be negative')
  .max(LIMITS.price.max, `Price cannot exceed ${LIMITS.price.max}`);
const images = z.array(z.url().max(LIMITS.images.urlMax)).max(LIMITS.images.max);

export const createListingSchema = z.object({
  title,
  description,
  category,
  type,
  price: price.default(0),
  images: images.default([]),
});

export const updateListingSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    category: category.optional(),
    type: type.optional(),
    price: price.optional(),
    status: status.optional(),
    images: images.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to update' });

export const listListingsQuery = z.object({
  search: z.string().trim().max(LIMITS.search.max).optional(),
  category: category.optional(),
  type: type.optional(),
  hostel: z.string().trim().max(LIMITS.hostel.max).optional(),
});

export const listingIdParams = idParams('id');
export const ownerIdParams = idParams('ownerId');
