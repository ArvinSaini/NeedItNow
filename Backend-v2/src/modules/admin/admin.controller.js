import * as admin from './admin.service.js';

export async function users(req, res) {
  const items = await admin.listUsers();
  res.json({ count: items.length, users: items });
}

export async function blockUser(req, res) {
  const user = await admin.setBlocked(req.validated.params.userId, req.user.id, true);
  res.json({ message: 'User blocked successfully', user });
}

export async function unblockUser(req, res) {
  const user = await admin.setBlocked(req.validated.params.userId, req.user.id, false);
  res.json({ message: 'User unblocked successfully', user });
}

export async function deleteUser(req, res) {
  await admin.deleteUser(req.validated.params.userId, req.user.id);
  res.json({ message: 'User deleted successfully' });
}

export async function listings(req, res) {
  const items = await admin.listListings();
  res.json({ count: items.length, listings: items });
}

export async function deleteListing(req, res) {
  await admin.deleteListing(req.validated.params.listingId);
  res.json({ message: 'Listing deleted successfully' });
}

export async function requests(req, res) {
  const items = await admin.listRequests();
  res.json({ count: items.length, requests: items });
}

export async function deleteRequest(req, res) {
  await admin.deleteRequest(req.validated.params.requestId);
  res.json({ message: 'Request deleted successfully' });
}
