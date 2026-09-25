import { ItemRequest } from './request.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { PUBLIC_USER_FIELDS } from '../../config/constants.js';

/** Public board: open and fulfilled requests (fulfilled ones show what the hostel helped with). */
export function listPublic() {
  return ItemRequest.find({ status: { $in: ['active', 'fulfilled'] } })
    .populate('requester', PUBLIC_USER_FIELDS)
    .sort({ createdAt: -1 });
}

export function listByUser(userId, tag) {
  const filter = { requester: userId };
  if (tag) filter.tags = tag; // equality on an array field matches any element
  return ItemRequest.find(filter).sort({ createdAt: -1 });
}

export async function getById(id) {
  const request = await ItemRequest.findById(id).populate('requester', PUBLIC_USER_FIELDS);
  if (!request) throw ApiError.notFound('Request not found');
  return request;
}

export function create(requesterId, data) {
  return ItemRequest.create({ ...data, requester: requesterId, status: 'active' });
}

async function findOwned(id, userId) {
  const request = await ItemRequest.findById(id);
  if (!request) throw ApiError.notFound('Request not found');
  if (request.requester.toString() !== userId) throw ApiError.forbidden('You can only change your own requests');
  return request;
}

export async function update(id, userId, changes) {
  const request = await findOwned(id, userId);
  request.set(changes); // `changes` is zod-validated, so only whitelisted fields can arrive here
  // validateModifiedOnly: legacy rows may have fields (e.g. description) that predate current limits;
  // only the fields actually being changed are revalidated, so those rows stay editable.
  return request.save({ validateModifiedOnly: true });
}

export async function remove(id, userId) {
  const request = await findOwned(id, userId);
  await request.deleteOne();
}
