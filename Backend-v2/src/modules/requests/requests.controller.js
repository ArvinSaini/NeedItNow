import * as requests from './requests.service.js';

export async function list(req, res) {
  const items = await requests.listPublic();
  res.json({ count: items.length, requests: items });
}

export async function listByUser(req, res) {
  const items = await requests.listByUser(req.validated.params.userId, req.validated.query.tag);
  res.json({ count: items.length, requests: items });
}

export async function get(req, res) {
  res.json(await requests.getById(req.validated.params.id));
}

export async function create(req, res) {
  const request = await requests.create(req.user.id, req.validated.body);
  res.status(201).json({ message: 'Request created successfully', requestId: request._id });
}

export async function update(req, res) {
  const request = await requests.update(req.validated.params.id, req.user.id, req.validated.body);
  res.json({ message: 'Request updated successfully', request });
}

export async function remove(req, res) {
  await requests.remove(req.validated.params.id, req.user.id);
  res.json({ message: 'Request deleted successfully' });
}
