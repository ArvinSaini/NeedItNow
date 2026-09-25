import { useTestDb, api, signup, signupAdmin, validUser, authHeader } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { User } from '../src/modules/users/user.model.js';

useTestDb();

describe('POST /user/signup', () => {
  it('creates a user and returns the legacy response shape', async () => {
    const body = validUser();
    const res = await api().post('/user/signup').send(body);
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'User created successfully');
    assert.equal(typeof res.body.token, 'string');
    assert.deepEqual(Object.keys(res.body.user).sort(), ['email', 'hostel', 'id', 'name', 'phone', 'role', 'roomNumber']);
    assert.equal(res.body.user.role, 'user');
    assert.equal(res.body.user.password, undefined);
  });

  it('returns field-level validation errors', async () => {
    const res = await api().post('/user/signup').send({ name: 'A1', email: 'nope', password: '123', phone: '12', hostel: '' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Validation failed');
    const fields = res.body.details.map((d) => d.field);
    for (const f of ['name', 'email', 'password', 'phone', 'hostel']) assert.ok(fields.includes(f), `missing ${f}`);
  });

  it('rejects a non-object body', async () => {
    const res = await api().post('/user/signup').send([]);
    assert.equal(res.status, 400);
  });

  it('normalises email case for duplicates and admin promotion', async () => {
    const first = await api().post('/user/signup').send(validUser({ email: 'Admin@Test.com' }));
    assert.equal(first.status, 201);
    assert.equal(first.body.user.role, 'admin');
    assert.equal(first.body.user.email, 'admin@test.com');
    const dup = await api().post('/user/signup').send(validUser({ email: 'ADMIN@test.com' }));
    assert.equal(dup.status, 409);
    assert.equal(dup.body.error, 'Email already registered');
  });

  it('ignores fields that are not part of the schema', async () => {
    const res = await api().post('/user/signup').send(validUser({ role: 'admin', isBlocked: true }));
    assert.equal(res.status, 201);
    assert.equal(res.body.user.role, 'user');
  });
});

describe('POST /user/signup - stricter email format', () => {
  const rejects = [
    'a@b',
    'a@b.c',
    '.rahul@gmail.com',
    'rahul.@gmail.com',
    'rahul..k@gmail.com',
    'rahul@gmail',
    'test@localhost',
    '1@2.3',
    'rahul@.com',
    // Passes zod's lighter z.email() (what LOGIN keeps using) but must fail the stricter pattern.
    '-a@b.com',
  ];
  for (const email of rejects) {
    it(`rejects ${email}`, async () => {
      const res = await api().post('/user/signup').send(validUser({ email }));
      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Validation failed');
      const field = res.body.details.find((d) => d.field === 'email');
      assert.ok(field, `expected an email validation error for ${email}`);
    });
  }

  const accepts = ['rahul123@gmail.com', 'rahul.k@college.ac.in', 'a+b@mail.in', 'x_y-z@domain.co'];
  for (const email of accepts) {
    it(`accepts ${email}`, async () => {
      const res = await api().post('/user/signup').send(validUser({ email }));
      assert.equal(res.status, 201);
      assert.equal(res.body.user.email, email);
    });
  }
});

describe('POST /user/login - stricter signup email rule does not lock out existing users', () => {
  it('logs in a pre-existing user whose email fails the new signup pattern', async () => {
    // '-a@b.com' passes zod's lighter z.email() (what LOGIN still uses) but fails the
    // stricter EMAIL_PATTERN now enforced at signup, since a local part may not start with '-'.
    const oddEmail = '-a@b.com';
    await User.collection.insertOne({
      name: 'Odd Email',
      email: oddEmail,
      password: 'secret123',
      phone: '9876543210',
      hostel: 'H4',
      role: 'user',
      isBlocked: false,
    });
    const res = await api().post('/user/login').send({ email: oddEmail, password: 'secret123' });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, oddEmail);
  });
});

describe('POST /user/login', () => {
  it('logs in with correct credentials', async () => {
    const { user, password } = await signup();
    const res = await api().post('/user/login').send({ email: user.email, password });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Login successful');
    assert.equal(typeof res.body.token, 'string');
    assert.equal(res.body.user.id, user.id);
  });

  it('rejects the NoSQL injection bypass', async () => {
    const { user } = await signup();
    const res = await api().post('/user/login').send({ email: user.email, password: { $ne: '' } });
    assert.equal(res.status, 400);
  });

  it('rejects a wrong password with 401', async () => {
    const { user } = await signup();
    const res = await api().post('/user/login').send({ email: user.email, password: 'wrong-pass' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid email or password');
  });

  it('rejects a blocked account with ACCOUNT_BLOCKED', async () => {
    const { user, password } = await signup();
    await User.updateOne({ _id: user.id }, { isBlocked: true });
    const res = await api().post('/user/login').send({ email: user.email, password });
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'ACCOUNT_BLOCKED');
  });
});

describe('GET /user/me and token handling', () => {
  it('returns the fresh user for a valid token', async () => {
    const { token, user } = await signup();
    const res = await api().get('/user/me').set(authHeader(token));
    assert.equal(res.status, 200);
    assert.equal(res.body.user.id, user.id);
    assert.equal(res.body.user.email, user.email);
  });

  it('401 TOKEN_MISSING without a header', async () => {
    const res = await api().get('/user/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'TOKEN_MISSING');
  });

  it('401 TOKEN_INVALID for garbage', async () => {
    const res = await api().get('/user/me').set(authHeader('not-a-token'));
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'TOKEN_INVALID');
  });

  it('401 TOKEN_EXPIRED for an expired token', async () => {
    const { user } = await signup();
    const expired = jwt.sign({ sub: user.id, role: 'user', exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET);
    const res = await api().get('/user/me').set(authHeader(expired));
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'TOKEN_EXPIRED');
  });

  it('401 USER_NOT_FOUND when the user was deleted after the token was issued', async () => {
    const { token, user } = await signup();
    await User.deleteOne({ _id: user.id });
    const res = await api().get('/user/me').set(authHeader(token));
    assert.equal(res.status, 401);
    assert.equal(res.body.code, 'USER_NOT_FOUND');
  });

  it('403 ACCOUNT_BLOCKED when blocked after the token was issued', async () => {
    const { token, user } = await signup();
    await User.updateOne({ _id: user.id }, { isBlocked: true });
    const res = await api().get('/user/me').set(authHeader(token));
    assert.equal(res.status, 403);
    assert.equal(res.body.code, 'ACCOUNT_BLOCKED');
  });
});

describe('GET /user/:id', () => {
  it('requires auth and returns only public fields', async () => {
    const { token, user } = await signup();
    const other = await signup();
    const anon = await api().get(`/user/${other.user.id}`);
    assert.equal(anon.status, 401);
    const res = await api().get(`/user/${other.user.id}`).set(authHeader(token));
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body).sort(), ['hostel', 'id', 'name', 'phone', 'roomNumber']);
    assert.equal(res.body.email, undefined);
    assert.notEqual(res.body.id, user.id);
  });

  it('400 for a malformed id and 404 for an unknown id', async () => {
    const { token } = await signup();
    const bad = await api().get('/user/not-an-id').set(authHeader(token));
    assert.equal(bad.status, 400);
    const missing = await api().get('/user/aaaaaaaaaaaaaaaaaaaaaaaa').set(authHeader(token));
    assert.equal(missing.status, 404);
  });
});

describe('aliases', () => {
  it('serves the same router at /api/v1/auth', async () => {
    const { user, password } = await signup();
    const res = await api().post('/api/v1/auth/login').send({ email: user.email, password });
    assert.equal(res.status, 200);
  });
});

describe('admin promotion', () => {
  it('promotes emails listed in ADMIN_EMAILS', async () => {
    const { user } = await signupAdmin();
    assert.equal(user.role, 'admin');
  });
});
