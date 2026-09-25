import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../modules/users/user.model.js';

function readBearer(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

/**
 * Verifies the JWT, then re-reads the user so blocking and role changes apply immediately.
 * Sets req.user = { id, role }. Error codes let the frontend tell "log in again" from other errors.
 */
export async function requireAuth(req, res, next) {
  const token = readBearer(req);
  if (!token) return next(ApiError.unauthorized('No token provided', { code: 'TOKEN_MISSING' }));

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return next(
      ApiError.unauthorized(expired ? 'Session expired, please log in again' : 'Invalid token', {
        code: expired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
      }),
    );
  }

  if (!mongoose.isValidObjectId(payload.sub)) {
    return next(ApiError.unauthorized('Invalid token', { code: 'TOKEN_INVALID' }));
  }
  const user = await User.findById(payload.sub).select('role isBlocked');
  if (!user) return next(ApiError.unauthorized('Account no longer exists', { code: 'USER_NOT_FOUND' }));
  if (user.isBlocked) {
    return next(ApiError.forbidden('Your account has been blocked. Contact admin.', { code: 'ACCOUNT_BLOCKED' }));
  }

  req.user = { id: user._id.toString(), role: user.role };
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return next(ApiError.forbidden('Admin access only'));
  next();
}

// An array (not a manual requireAuth(req, res, cb) wrapper) so requireAuth's rejected promise
// is handled by Express's own async chaining instead of being dropped on the floor.
export const requireAdmin = [requireAuth, adminOnly];
