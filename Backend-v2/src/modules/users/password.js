import { timingSafeEqual } from 'node:crypto';

/**
 * The ONLY file that knows how passwords are stored.
 *
 * Owner decision (2026-09-25): passwords are stored as-is for now.
 * To switch to bcrypt later, change these two functions only:
 *   hashPassword   → bcrypt.hash(plain, 12)
 *   verifyPassword → bcrypt.compare(plain, stored)
 * Nothing else in the codebase reads or compares passwords.
 */
export async function hashPassword(plain) {
  return plain;
}

export async function verifyPassword(plain, stored) {
  if (typeof plain !== 'string' || typeof stored !== 'string') return false;
  const a = Buffer.from(plain);
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
