import { useTestDb, api, signup, authHeader } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

useTestDb();

describe('PUT /user/password', () => {
  it('requires auth', async () => {
    const res = await api().put('/user/password').send({ currentPassword: 'a', newPassword: 'bbbbbbb' });
    assert.equal(res.status, 401);
  });

  it('rejects a wrong current password with 400 WRONG_PASSWORD (not a session error)', async () => {
    const { token } = await signup();
    const res = await api().put('/user/password').set(authHeader(token)).send({ currentPassword: 'nope-nope', newPassword: 'newpass123' });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, 'WRONG_PASSWORD');
  });

  it('rejects a too-short new password', async () => {
    const { token, password } = await signup();
    const res = await api().put('/user/password').set(authHeader(token)).send({ currentPassword: password, newPassword: '123' });
    assert.equal(res.status, 400);
    assert.equal(res.body.details[0].field, 'newPassword');
  });

  it('rejects reusing the current password', async () => {
    const { token, password } = await signup();
    const res = await api().put('/user/password').set(authHeader(token)).send({ currentPassword: password, newPassword: password });
    assert.equal(res.status, 400);
  });

  it('changes the password: old one stops working, new one logs in', async () => {
    const { token, user, password } = await signup();
    const res = await api().put('/api/v1/auth/password').set(authHeader(token)).send({ currentPassword: password, newPassword: 'newpass123' });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Password updated successfully');
    const old = await api().post('/user/login').send({ email: user.email, password });
    assert.equal(old.status, 401);
    const fresh = await api().post('/user/login').send({ email: user.email, password: 'newpass123' });
    assert.equal(fresh.status, 200);
  });
});
