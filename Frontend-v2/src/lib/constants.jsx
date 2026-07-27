import {
  LuBookOpen,
  LuLaptop,
  LuShirt,
  LuBike,
  LuUtensils,
  LuPencil,
  LuPackage,
} from 'react-icons/lu';

/* Matches Backend enum: ['electronics','books','sports','utensils','clothing','stationery','other'] */
export const CATEGORIES = [
  { id: 'books', label: 'Books', icon: LuBookOpen },
  { id: 'electronics', label: 'Electronics', icon: LuLaptop },
  { id: 'clothing', label: 'Clothing', icon: LuShirt },
  { id: 'sports', label: 'Sports', icon: LuBike },
  { id: 'utensils', label: 'Utensils', icon: LuUtensils },
  { id: 'stationery', label: 'Stationery', icon: LuPencil },
  { id: 'other', label: 'Other', icon: LuPackage },
];

export function getCategory(value) {
  const id = String(value || '').toLowerCase();
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

/* Backend enum: ['low','medium','high'] */
export const URGENCY = [
  { id: 'high', label: 'High', tone: 'red' },
  { id: 'medium', label: 'Medium', tone: 'amber' },
  { id: 'low', label: 'Low', tone: 'gray' },
];

export function getUrgency(value) {
  const id = String(value || '').toLowerCase();
  return URGENCY.find((u) => u.id === id) || URGENCY[2];
}

/* Backend listing status enum: ['available','unavailable','borrowed'] */
export const LISTING_STATUS = {
  available: { label: 'Available', tone: 'ok' },
  unavailable: { label: 'Unavailable', tone: 'gray' },
  borrowed: { label: 'Lent out', tone: 'gray' },
};

export function getListingStatus(value) {
  return LISTING_STATUS[String(value || '').toLowerCase()] || { label: value || '—', tone: 'gray' };
}

/* Backend request status enum: ['active','fulfilled','cancelled'] */
export const REQUEST_STATUS = {
  active: { label: 'Active', tone: 'ok' },
  fulfilled: { label: 'Fulfilled', tone: 'cream' },
  cancelled: { label: 'Cancelled', tone: 'gray' },
};

export function getRequestStatus(value) {
  return REQUEST_STATUS[String(value || '').toLowerCase()] || { label: value || '—', tone: 'gray' };
}

/* Backend listing type enum: ['lend','sell'] */
export const LISTING_TYPE = {
  lend: { label: 'Lend', tone: 'cream' },
  sell: { label: 'Sell', tone: 'red' },
};

export function getListingType(value) {
  return LISTING_TYPE[String(value || '').toLowerCase()] || { label: value || '—', tone: 'gray' };
}
