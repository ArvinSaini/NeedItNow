// Single source of truth for enums and limits. The frontend mirrors these in src/lib/constants.jsx.
export const CATEGORIES = ['electronics', 'books', 'sports', 'utensils', 'clothing', 'stationery', 'other'];
export const LISTING_TYPES = ['lend', 'sell'];
export const LISTING_STATUSES = ['available', 'unavailable', 'borrowed'];
export const REQUEST_STATUSES = ['active', 'fulfilled', 'cancelled'];
export const URGENCIES = ['low', 'medium', 'high'];
export const ROLES = ['user', 'admin'];

export const LIMITS = {
  name: { min: 2, max: 50 },
  email: { max: 80 },
  password: { min: 6, max: 64 },
  hostel: { min: 1, max: 30 },
  roomNumber: { max: 8 },
  title: { min: 3, max: 80 },
  description: { min: 10, max: 500 },
  price: { max: 100000 },
  images: { max: 5, urlMax: 500 },
  tags: { max: 5, each: 20 },
  search: { max: 100 },
};
