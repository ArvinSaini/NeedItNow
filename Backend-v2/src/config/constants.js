// Single source of truth for enums and limits. The frontend mirrors these in src/lib/constants.jsx.
export const CATEGORIES = ['electronics', 'books', 'sports', 'utensils', 'clothing', 'stationery', 'other'];
export const LISTING_TYPES = ['lend', 'sell'];
export const LISTING_STATUSES = ['available', 'unavailable', 'borrowed'];
export const REQUEST_STATUSES = ['active', 'fulfilled', 'cancelled'];
export const URGENCIES = ['low', 'medium', 'high'];
export const ROLES = ['user', 'admin'];

// Fields safe to expose about a listing/request owner to any caller (no email/password internals beyond this).
export const PUBLIC_USER_FIELDS = 'name email phone hostel roomNumber';

// Owner-approved stricter email format, applied to the already-trimmed, lowercased email at SIGNUP only.
// Frontend-v2 mirrors this exact pattern in src/lib/constants.jsx as EMAIL_PATTERN.
export const EMAIL_PATTERN = /^[a-z0-9]+([._+-][a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

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
