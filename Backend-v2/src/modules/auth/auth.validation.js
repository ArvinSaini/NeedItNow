import { z } from 'zod';
import { EMAIL_PATTERN, LIMITS } from '../../config/constants.js';
import { idParams } from '../../utils/objectId.js';

const email = z.string().trim().toLowerCase().max(LIMITS.email.max).pipe(z.email('Enter a valid email'));
// Stricter than LOGIN's `email` above: SIGNUP only, so no existing user gets locked out by this rule.
const signupEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(LIMITS.email.max)
  .regex(EMAIL_PATTERN, 'Enter a valid email like name@gmail.com');
const password = z
  .string()
  .min(LIMITS.password.min, `Password must be at least ${LIMITS.password.min} characters`)
  .max(LIMITS.password.max, `Password must be at most ${LIMITS.password.max} characters`);

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.name.min, `Name must be at least ${LIMITS.name.min} letters`)
    .max(LIMITS.name.max)
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters'),
  email: signupEmail,
  password,
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  hostel: z.string().trim().min(LIMITS.hostel.min, 'Hostel is required').max(LIMITS.hostel.max),
  roomNumber: z
    .string()
    .trim()
    .max(LIMITS.roomNumber.max)
    .regex(/^[a-zA-Z0-9-]*$/, 'Room number can only contain letters, numbers and dashes')
    .optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(LIMITS.password.max),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').max(LIMITS.password.max),
  newPassword: password,
});

export const userIdParams = idParams('id');
