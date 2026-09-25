import { User } from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { hashPassword, verifyPassword } from './password.js';

const PUBLIC_PROFILE_FIELDS = 'name hostel roomNumber phone';

export function findByEmail(email, { withPassword = false } = {}) {
  const query = User.findOne({ email });
  return withPassword ? query.select('+password') : query;
}

export function findById(id) {
  return User.findById(id);
}

export async function createUser(data, role) {
  return User.create({ ...data, password: await hashPassword(data.password), role });
}

/** What any logged-in user may see about another user: the same fields the listing cards show. */
export async function getPublicProfile(id) {
  const user = await User.findById(id).select(PUBLIC_PROFILE_FIELDS);
  if (!user) throw ApiError.notFound('User not found');
  return { id: user._id, name: user.name, hostel: user.hostel, roomNumber: user.roomNumber, phone: user.phone };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound('User not found');
  if (!(await verifyPassword(currentPassword, user.password))) {
    // 400 (not 401) so the frontend does not mistake it for a dead session
    throw ApiError.badRequest('Current password is incorrect', { code: 'WRONG_PASSWORD' });
  }
  if (currentPassword === newPassword) {
    throw ApiError.badRequest('New password must be different from the current one');
  }
  user.password = await hashPassword(newPassword);
  await user.save({ validateModifiedOnly: true });
}
