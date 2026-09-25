import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import * as users from '../users/users.service.js';
import { verifyPassword } from '../users/password.js';

export function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

/** The user object the frontend stores in localStorage (legacy shape). */
export function toAuthUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    hostel: user.hostel,
    roomNumber: user.roomNumber,
  };
}

export async function signup(data) {
  if (await users.findByEmail(data.email)) throw ApiError.conflict('Email already registered');
  const role = config.ADMIN_EMAILS.includes(data.email) ? 'admin' : 'user';
  const user = await users.createUser(data, role);
  return { token: issueToken(user), user: toAuthUser(user) };
}

export async function login({ email, password }) {
  const user = await users.findByEmail(email, { withPassword: true });
  // Same message for unknown email and wrong password: do not reveal which emails exist.
  if (!user || !(await verifyPassword(password, user.password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (user.isBlocked) {
    throw ApiError.forbidden('Your account has been blocked. Contact admin.', { code: 'ACCOUNT_BLOCKED' });
  }
  return { token: issueToken(user), user: toAuthUser(user) };
}

export async function me(userId) {
  const user = await users.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return toAuthUser(user);
}
