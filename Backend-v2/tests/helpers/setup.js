import './env.js';
import { before, after, beforeEach } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { connectDb, disconnectDb } from '../../src/db/connect.js';

let mongod;

export const app = createApp();
export const api = () => request(app);
export const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

/** Call once at the top of a test file: in-memory MongoDB for the whole file, wiped before each test. */
export function useTestDb() {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDb(mongod.getUri());
  });
  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });
  after(async () => {
    await disconnectDb();
    await mongod.stop();
  });
}

let counter = 0;
export const validUser = (overrides = {}) => ({
  name: 'Test User',
  email: `user${++counter}@test.com`,
  password: 'secret123',
  phone: '9876543210',
  hostel: 'H4',
  roomNumber: '212',
  ...overrides,
});

/** Signs up a fresh user and returns { token, user, password }. Throws if signup fails. */
export async function signup(overrides = {}) {
  const body = validUser(overrides);
  const res = await api().post('/user/signup').send(body);
  if (res.status !== 201) throw new Error(`signup failed: ${JSON.stringify(res.body)}`);
  return { token: res.body.token, user: res.body.user, password: body.password };
}

export const signupAdmin = (overrides = {}) => signup({ email: 'admin@test.com', ...overrides });
