import { useTestDb, api, signup, authHeader } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Listing } from '../src/modules/listings/listing.model.js';

useTestDb();

const valid = (overrides = {}) => ({
  title: 'Kreyszig Engineering Maths',
  description: 'Good condition, can lend for two weeks. Pick up from room 212.',
  category: 'books',
  type: 'lend',
  price: 0,
  ...overrides,
});

async function createListing(token, overrides = {}) {
  const res = await api().post('/product').set(authHeader(token)).send(valid(overrides));
  if (res.status !== 201) throw new Error(JSON.stringify(res.body));
  return res.body.listingId;
}

describe('POST /product', () => {
  it('requires auth', async () => {
    const res = await api().post('/product').send(valid());
    assert.equal(res.status, 401);
  });

  it('creates a listing owned by the caller', async () => {
    const { token, user } = await signup();
    const res = await api().post('/product').set(authHeader(token)).send(valid({ owner: 'aaaaaaaaaaaaaaaaaaaaaaaa', status: 'borrowed' }));
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Listing created successfully');
    const listing = (await api().get(`/product/${res.body.listingId}`)).body;
    assert.equal(listing.owner._id, user.id);
    assert.equal(listing.status, 'available');
  });

  it('coerces a numeric string price and accepts boundary lengths', async () => {
    const { token } = await signup();
    const id = await createListing(token, { price: '1200', title: 'x'.repeat(80), description: 'y'.repeat(500) });
    const listing = (await api().get(`/product/${id}`)).body;
    assert.equal(listing.price, 1200);
  });

  it('rejects bad input with field details', async () => {
    const { token } = await signup();
    const res = await api().post('/product').set(authHeader(token)).send({
      title: 'ab', description: 'short', category: 'weapons', type: 'rent', price: -5,
    });
    assert.equal(res.status, 400);
    const fields = res.body.details.map((d) => d.field);
    for (const f of ['title', 'description', 'category', 'type', 'price']) assert.ok(fields.includes(f), `missing ${f}`);
    const tooLong = await api().post('/product').set(authHeader(token)).send(valid({ description: 'y'.repeat(501) }));
    assert.equal(tooLong.status, 400);
  });
});

describe('GET /product', () => {
  it('lists only available listings, newest first, with owner populated', async () => {
    const { token } = await signup();
    const first = await createListing(token, { title: 'First listing' });
    const second = await createListing(token, { title: 'Second listing' });
    await api().put(`/product/${first}`).set(authHeader(token)).send({ status: 'unavailable' });
    const res = await api().get('/product');
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 1);
    assert.equal(res.body.listings[0]._id, second);
    assert.equal(typeof res.body.listings[0].owner.name, 'string');
    assert.equal(res.body.listings[0].owner.password, undefined);
  });

  it('filters by search (regex-safe), category and type', async () => {
    const { token } = await signup();
    await createListing(token, { title: 'C++ (Primer) [5th]', category: 'books', type: 'sell', price: 300 });
    await createListing(token, { title: 'Badminton racket', category: 'sports', type: 'lend' });
    const search = await api().get('/product').query({ search: '(Primer) [5th]' });
    assert.equal(search.body.count, 1);
    const cat = await api().get('/product').query({ category: 'sports' });
    assert.equal(cat.body.count, 1);
    const type = await api().get('/product').query({ type: 'sell' });
    assert.equal(type.body.count, 1);
  });

  it('filters by owner hostel', async () => {
    const a = await signup({ hostel: 'H1' });
    const b = await signup({ hostel: 'H2' });
    await createListing(a.token);
    await createListing(b.token);
    const res = await api().get('/product').query({ hostel: 'H2' });
    assert.equal(res.body.count, 1);
  });

  it('rejects a repeated query param and an unknown category', async () => {
    const dup = await api().get('/product?category=books&category=sports');
    assert.equal(dup.status, 400);
    const bad = await api().get('/product').query({ category: 'nope' });
    assert.equal(bad.status, 400);
  });
});

describe('GET /product/owner/:ownerId', () => {
  it('includes unavailable listings so owners can edit them back', async () => {
    const { token, user } = await signup();
    const id = await createListing(token);
    await api().put(`/product/${id}`).set(authHeader(token)).send({ status: 'unavailable' });
    const res = await api().get(`/product/owner/${user.id}`);
    assert.equal(res.body.count, 1);
    assert.equal(res.body.listings[0].status, 'unavailable');
  });
});

describe('GET /product/:id', () => {
  it('400 for a bad id, 404 for a missing one', async () => {
    assert.equal((await api().get('/product/xyz')).status, 400);
    assert.equal((await api().get('/product/aaaaaaaaaaaaaaaaaaaaaaaa')).status, 404);
  });
});

describe('PUT /product/:id', () => {
  it('lets the owner update whitelisted fields only', async () => {
    const { token, user } = await signup();
    const id = await createListing(token);
    const res = await api().put(`/product/${id}`).set(authHeader(token)).send({ title: 'New title here', price: 50, owner: 'aaaaaaaaaaaaaaaaaaaaaaaa' });
    assert.equal(res.status, 200);
    assert.equal(res.body.listing.title, 'New title here');
    assert.equal(res.body.listing.price, 50);
    assert.equal(res.body.listing.owner, user.id);
  });

  it('rejects an empty update', async () => {
    const { token } = await signup();
    const id = await createListing(token);
    const res = await api().put(`/product/${id}`).set(authHeader(token)).send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.details[0].message, 'Nothing to update');
  });

  it('forbids non-owners', async () => {
    const owner = await signup();
    const other = await signup();
    const id = await createListing(owner.token);
    const res = await api().put(`/product/${id}`).set(authHeader(other.token)).send({ title: 'Hijacked title' });
    assert.equal(res.status, 403);
  });

  it('lets the owner update a legacy listing whose description exceeds current limits', async () => {
    const { token, user } = await signup();
    const legacy = {
      title: 'Legacy listing title',
      description: 'z'.repeat(600),
      category: 'books',
      type: 'lend',
      price: 10,
      status: 'available',
      owner: new mongoose.Types.ObjectId(user.id),
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { insertedId } = await Listing.collection.insertOne(legacy);
    const res = await api().put(`/product/${insertedId}`).set(authHeader(token)).send({ price: 75 });
    assert.equal(res.status, 200);
    assert.equal(res.body.listing.price, 75);
  });
});

describe('DELETE /product/:id', () => {
  it('forbids non-owners and lets the owner delete', async () => {
    const owner = await signup();
    const other = await signup();
    const id = await createListing(owner.token);
    assert.equal((await api().delete(`/product/${id}`).set(authHeader(other.token))).status, 403);
    const res = await api().delete(`/api/v1/listings/${id}`).set(authHeader(owner.token));
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Listing deleted successfully');
    assert.equal((await api().get(`/product/${id}`)).status, 404);
  });
});
