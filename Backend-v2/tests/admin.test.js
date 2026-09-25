import { useTestDb, api, signup, signupAdmin, authHeader } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

useTestDb();

const listing = { title: 'Spare kettle', description: 'Works fine, lend for a few days at a time.', category: 'utensils', type: 'lend' };
const request = { title: 'Need a lamp', description: 'Study lamp for the next two weeks please.', category: 'electronics' };

describe('admin gating', () => {
  it('401 without a token, 403 for a normal user', async () => {
    assert.equal((await api().get('/admin/users')).status, 401);
    const { token } = await signup();
    const res = await api().get('/admin/users').set(authHeader(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.error, 'Admin access only');
  });

  it('403 for a forged admin role in the token; the DB role is what counts', async () => {
    const { token, user } = await signup();
    const forged = jwt.sign({ sub: user.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    assert.notEqual(forged, token);
    const res = await api().get('/admin/users').set(authHeader(forged));
    assert.equal(res.status, 403);
  });
});

describe('user management', () => {
  it('lists users without passwords', async () => {
    const admin = await signupAdmin();
    await signup();
    const res = await api().get('/admin/users').set(authHeader(admin.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);
    for (const u of res.body.users) assert.equal(u.password, undefined);
  });

  it('blocks and unblocks a user, and the block takes effect immediately', async () => {
    const admin = await signupAdmin();
    const target = await signup();
    const block = await api().put(`/admin/users/${target.user.id}/block`).set(authHeader(admin.token));
    assert.equal(block.status, 200);
    assert.equal(block.body.user.isBlocked, true);
    assert.equal(block.body.message, 'User blocked successfully');
    assert.equal((await api().get('/user/me').set(authHeader(target.token))).status, 403);
    const unblock = await api().put(`/admin/users/${target.user.id}/unblock`).set(authHeader(admin.token));
    assert.equal(unblock.body.user.isBlocked, false);
    assert.equal((await api().get('/user/me').set(authHeader(target.token))).status, 200);
  });

  it('refuses to block or delete yourself', async () => {
    const admin = await signupAdmin();
    assert.equal((await api().put(`/admin/users/${admin.user.id}/block`).set(authHeader(admin.token))).status, 400);
    assert.equal((await api().delete(`/admin/users/${admin.user.id}`).set(authHeader(admin.token))).status, 400);
  });

  it('deletes a user and cascades their listings and requests', async () => {
    const admin = await signupAdmin();
    const target = await signup();
    await api().post('/product').set(authHeader(target.token)).send(listing);
    await api().post('/request').set(authHeader(target.token)).send(request);
    const res = await api().delete(`/admin/users/${target.user.id}`).set(authHeader(admin.token));
    assert.equal(res.status, 200);
    assert.equal((await api().get('/product')).body.count, 0);
    assert.equal((await api().get('/request')).body.count, 0);
    assert.equal((await api().delete(`/admin/users/${target.user.id}`).set(authHeader(admin.token))).status, 404);
  });
});

describe('listing and request management', () => {
  it('lists every listing regardless of status and deletes one', async () => {
    const admin = await signupAdmin();
    const user = await signup();
    const created = await api().post('/product').set(authHeader(user.token)).send(listing);
    await api().put(`/product/${created.body.listingId}`).set(authHeader(user.token)).send({ status: 'unavailable' });
    const list = await api().get('/admin/listings').set(authHeader(admin.token));
    assert.equal(list.body.count, 1);
    assert.equal(typeof list.body.listings[0].owner.name, 'string');
    const del = await api().delete(`/api/v1/admin/listings/${created.body.listingId}`).set(authHeader(admin.token));
    assert.equal(del.status, 200);
    assert.equal(del.body.message, 'Listing deleted successfully');
    assert.equal((await api().delete(`/admin/listings/${created.body.listingId}`).set(authHeader(admin.token))).status, 404);
  });

  it('lists every request and deletes one', async () => {
    const admin = await signupAdmin();
    const user = await signup();
    const created = await api().post('/request').set(authHeader(user.token)).send(request);
    await api().put(`/request/${created.body.requestId}`).set(authHeader(user.token)).send({ status: 'cancelled' });
    const list = await api().get('/admin/requests').set(authHeader(admin.token));
    assert.equal(list.body.count, 1);
    const del = await api().delete(`/admin/requests/${created.body.requestId}`).set(authHeader(admin.token));
    assert.equal(del.status, 200);
    assert.equal((await api().get(`/request/${created.body.requestId}`)).status, 404);
  });

  it('400 for malformed ids', async () => {
    const admin = await signupAdmin();
    assert.equal((await api().delete('/admin/listings/nope').set(authHeader(admin.token))).status, 400);
    assert.equal((await api().put('/admin/users/nope/block').set(authHeader(admin.token))).status, 400);
  });
});
