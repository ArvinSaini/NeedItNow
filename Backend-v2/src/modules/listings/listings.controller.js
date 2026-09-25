import * as listings from './listings.service.js';

export async function list(req, res) {
  const items = await listings.listPublic(req.validated.query);
  res.json({ count: items.length, listings: items });
}

export async function listByOwner(req, res) {
  const items = await listings.listByOwner(req.validated.params.ownerId);
  res.json({ count: items.length, listings: items });
}

export async function get(req, res) {
  res.json(await listings.getById(req.validated.params.id));
}

export async function create(req, res) {
  const listing = await listings.create(req.user.id, req.validated.body);
  res.status(201).json({ message: 'Listing created successfully', listingId: listing._id });
}

export async function update(req, res) {
  const listing = await listings.update(req.validated.params.id, req.user.id, req.validated.body);
  res.json({ message: 'Listing updated successfully', listing });
}

export async function remove(req, res) {
  await listings.remove(req.validated.params.id, req.user.id);
  res.json({ message: 'Listing deleted successfully' });
}
