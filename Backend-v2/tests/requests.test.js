import { useTestDb, api, signup, authHeader } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { ItemRequest } from '../src/modules/requests/request.model.js';

useTestDb();

const valid = (overrides = {}) => ({
  title: 'Scientific calculator',
  description: 'Need one for the exam next Monday, will return the same evening.',
  category: 'electronics',
  urgency: 'high',
  tags: ['exam', 'urgent'],
  ...overrides,
});

async function createRequest(token, overrides = {}) {
  const res = await api().post('/request').set(authHeader(token)).send(valid(overrides));
  if (res.status !== 201) throw new Error(JSON.stringify(res.body));
  return res.body.requestId;
}

describe('POST /request', () => {
  it('requires auth', async () => {
    assert.equal((await api().post('/request').send(valid())).status, 401);
  });

  it('creates a request for the caller with defaults', async () => {
    const { token, user } = await signup();
    const res = await api().post('/request').set(authHeader(token)).send({ title: 'Kettle please', description: 'Electric kettle for a week, any brand is fine.', category: 'utensils', requester: 'aaaaaaaaaaaaaaaaaaaaaaaa', status: 'fulfilled' });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Request created successfully');
    const request = (await api().get(`/request/${res.body.requestId}`)).body;
    assert.equal(request.requester._id, user.id);
    assert.equal(request.status, 'active');
    assert.equal(request.urgency, 'medium');
    assert.deepEqual(request.tags, []);
  });

  it('validates urgency, tags and lengths', async () => {
    const { token } = await signup();
    const res = await api().post('/request').set(authHeader(token)).send(valid({ urgency: 'asap', tags: ['a', 'b', 'c', 'd', 'e', 'f'], title: 'ab' }));
    assert.equal(res.status, 400);
    const fields = res.body.details.map((d) => d.field);
    for (const f of ['urgency', 'tags', 'title']) assert.ok(fields.includes(f), `missing ${f}`);
  });
});

describe('GET /request', () => {
  it('lists active and fulfilled requests but not cancelled ones', async () => {
    const { token } = await signup();
    const a = await createRequest(token, { title: 'Active one' });
    const b = await createRequest(token, { title: 'Fulfilled one' });
    const c = await createRequest(token, { title: 'Cancelled one' });
    await api().put(`/request/${b}`).set(authHeader(token)).send({ status: 'fulfilled' });
    await api().put(`/request/${c}`).set(authHeader(token)).send({ status: 'cancelled' });
    const res = await api().get('/request');
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);
    assert.deepEqual(res.body.requests.map((r) => r._id).sort(), [a, b].sort());
    assert.equal(typeof res.body.requests[0].requester.name, 'string');
  });
});

describe('GET /request/user/:userId', () => {
  it('returns all of a user\'s requests and filters by tag', async () => {
    const { token, user } = await signup();
    await createRequest(token, { tags: ['exam'] });
    const cancelled = await createRequest(token, { tags: ['other'] });
    await api().put(`/request/${cancelled}`).set(authHeader(token)).send({ status: 'cancelled' });
    const all = await api().get(`/request/user/${user.id}`);
    assert.equal(all.body.count, 2);
    const tagged = await api().get(`/request/user/${user.id}`).query({ tag: 'exam' });
    assert.equal(tagged.body.count, 1);
  });
});

describe('PUT and DELETE /request/:id', () => {
  it('only the requester may update, and requester cannot be reassigned', async () => {
    const owner = await signup();
    const other = await signup();
    const id = await createRequest(owner.token);
    assert.equal((await api().put(`/request/${id}`).set(authHeader(other.token)).send({ title: 'Hijacked title' })).status, 403);
    const res = await api().put(`/request/${id}`).set(authHeader(owner.token)).send({ title: 'Updated title', requester: other.user.id });
    assert.equal(res.status, 200);
    assert.equal(res.body.request.title, 'Updated title');
    assert.equal(res.body.request.requester, owner.user.id);
  });

  it('rejects an empty update and a bad id', async () => {
    const { token } = await signup();
    const id = await createRequest(token);
    assert.equal((await api().put(`/request/${id}`).set(authHeader(token)).send({})).status, 400);
    assert.equal((await api().put('/request/bad-id').set(authHeader(token)).send({ title: 'Valid title' })).status, 400);
  });

  it('only the requester may delete', async () => {
    const owner = await signup();
    const other = await signup();
    const id = await createRequest(owner.token);
    assert.equal((await api().delete(`/request/${id}`).set(authHeader(other.token))).status, 403);
    const res = await api().delete(`/api/v1/requests/${id}`).set(authHeader(owner.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Request deleted successfully');
    assert.equal((await api().get(`/request/${id}`)).status, 404);
  });

  it('lets the requester update a legacy request whose description exceeds current limits', async () => {
    const { token, user } = await signup();
    const legacy = {
      title: 'Legacy request title',
      description: 'z'.repeat(600),
      category: 'electronics',
      requester: new mongoose.Types.ObjectId(user.id),
      urgency: 'medium',
      status: 'active',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { insertedId } = await ItemRequest.collection.insertOne(legacy);
    const res = await api().put(`/request/${insertedId}`).set(authHeader(token)).send({ status: 'fulfilled' });
    assert.equal(res.status, 200);
    assert.equal(res.body.request.status, 'fulfilled');
  });
});
