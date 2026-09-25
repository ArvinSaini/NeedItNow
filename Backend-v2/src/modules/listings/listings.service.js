import { Listing } from './listing.model.js';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { escapeRegex } from '../../utils/escapeRegex.js';
import { PUBLIC_USER_FIELDS } from '../../config/constants.js';

export async function listPublic({ search, category, type, hostel } = {}) {
  const filter = { status: 'available' };
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (hostel) {
    const owners = await User.find({ hostel }).select('_id');
    filter.owner = { $in: owners.map((u) => u._id) };
  }
  return Listing.find(filter).populate('owner', PUBLIC_USER_FIELDS).sort({ createdAt: -1 });
}

/** Owner's own view: every status, so an item marked unavailable can still be edited. */
export function listByOwner(ownerId) {
  return Listing.find({ owner: ownerId }).sort({ createdAt: -1 });
}

export async function getById(id) {
  const listing = await Listing.findById(id).populate('owner', PUBLIC_USER_FIELDS);
  if (!listing) throw ApiError.notFound('Listing not found');
  return listing;
}

export function create(ownerId, data) {
  return Listing.create({ ...data, owner: ownerId, status: 'available' });
}

async function findOwned(id, userId) {
  const listing = await Listing.findById(id);
  if (!listing) throw ApiError.notFound('Listing not found');
  if (listing.owner.toString() !== userId) throw ApiError.forbidden('You can only change your own listings');
  return listing;
}

export async function update(id, userId, changes) {
  const listing = await findOwned(id, userId);
  listing.set(changes); // `changes` is zod-validated, so only whitelisted fields can arrive here
  // validateModifiedOnly: legacy rows may have fields (e.g. description) that predate current limits;
  // only the fields actually being changed are revalidated, so those rows stay editable.
  return listing.save({ validateModifiedOnly: true });
}

export async function remove(id, userId) {
  const listing = await findOwned(id, userId);
  await listing.deleteOne();
}
