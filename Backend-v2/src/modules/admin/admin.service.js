import { User } from '../users/user.model.js';
import { Listing } from '../listings/listing.model.js';
import { ItemRequest } from '../requests/request.model.js';
import { ApiError } from '../../utils/ApiError.js';

const PERSON_FIELDS = 'name email phone hostel roomNumber';

export function listUsers() {
  return User.find().sort({ createdAt: -1 });
}

export async function setBlocked(userId, adminId, isBlocked) {
  if (userId === adminId) throw ApiError.badRequest(`You cannot ${isBlocked ? 'block' : 'unblock'} your own account`);
  const user = await User.findByIdAndUpdate(userId, { isBlocked }, { returnDocument: 'after' });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

/** Removes the user and everything they posted, so no listing or request is left with an unknown owner. */
export async function deleteUser(userId, adminId) {
  if (userId === adminId) throw ApiError.badRequest('You cannot delete your own account');
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw ApiError.notFound('User not found');
  await Promise.all([Listing.deleteMany({ owner: userId }), ItemRequest.deleteMany({ requester: userId })]);
}

export function listListings() {
  return Listing.find().populate('owner', PERSON_FIELDS).sort({ createdAt: -1 });
}

export async function deleteListing(id) {
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) throw ApiError.notFound('Listing not found');
}

export function listRequests() {
  return ItemRequest.find().populate('requester', PERSON_FIELDS).sort({ createdAt: -1 });
}

export async function deleteRequest(id) {
  const request = await ItemRequest.findByIdAndDelete(id);
  if (!request) throw ApiError.notFound('Request not found');
}
