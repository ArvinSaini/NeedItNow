import { useTestDb } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../src/modules/users/user.model.js';
import { hashPassword, verifyPassword } from '../src/modules/users/password.js';
import { findByEmail, createUser, getPublicProfile, changePassword } from '../src/modules/users/users.service.js';

useTestDb();

const data = { name: 'Asha', email: 'asha@test.com', password: 'secret123', phone: '9876543210', hostel: 'H2', roomNumber: '101' };

describe('password seam', () => {
  it('verifies a matching password', async () => {
    assert.equal(await verifyPassword('secret123', await hashPassword('secret123')), true);
  });
  it('rejects a wrong password and different lengths', async () => {
    assert.equal(await verifyPassword('secret124', await hashPassword('secret123')), false);
    assert.equal(await verifyPassword('short', await hashPassword('secret123')), false);
  });
  it('rejects non-string inputs', async () => {
    assert.equal(await verifyPassword({ $ne: '' }, 'secret123'), false);
    assert.equal(await verifyPassword('secret123', undefined), false);
  });
});

describe('user model', () => {
  it('never serialises the password', async () => {
    const user = await createUser(data, 'user');
    const json = user.toJSON();
    assert.equal(json.password, undefined);
    assert.equal(json.__v, undefined);
    assert.equal(json.email, 'asha@test.com');
  });
  it('hides the password from ordinary queries', async () => {
    await createUser(data, 'user');
    const plain = await findByEmail('asha@test.com');
    assert.equal(plain.password, undefined);
    const withPassword = await findByEmail('asha@test.com', { withPassword: true });
    assert.equal(typeof withPassword.password, 'string');
  });
  it('stores the given role', async () => {
    const admin = await createUser({ ...data, email: 'boss@test.com' }, 'admin');
    assert.equal(admin.role, 'admin');
  });
});

describe('users service', () => {
  it('returns only public profile fields', async () => {
    const user = await createUser(data, 'user');
    const profile = await getPublicProfile(user._id.toString());
    assert.deepEqual(Object.keys(profile).sort(), ['hostel', 'id', 'name', 'phone', 'roomNumber']);
  });
  it('changes the password only when the current one matches', async () => {
    const user = await createUser(data, 'user');
    await assert.rejects(changePassword(user._id.toString(), 'wrong', 'newpass123'), { status: 400 });
    await assert.rejects(changePassword(user._id.toString(), 'secret123', 'secret123'), { status: 400 });
    await changePassword(user._id.toString(), 'secret123', 'newpass123');
    const fresh = await User.findById(user._id).select('+password');
    assert.equal(await verifyPassword('newpass123', fresh.password), true);
  });
  it('allows legacy users to change password even when other fields violate schema', async () => {
    // Create a user directly with a name longer than 50 chars to bypass validation
    const longName = 'a'.repeat(55);
    const legacyUser = await User.collection.insertOne({
      name: longName,
      email: 'legacy@test.com',
      password: await hashPassword('secret123'),
      phone: '9876543210',
      hostel: 'H2',
      roomNumber: '101',
      role: 'user',
    });
    // Now verify that changePassword succeeds without trying to validate the name
    await changePassword(legacyUser.insertedId.toString(), 'secret123', 'newpass123');
    const updated = await User.findById(legacyUser.insertedId).select('+password');
    assert.equal(await verifyPassword('newpass123', updated.password), true);
  });
});
