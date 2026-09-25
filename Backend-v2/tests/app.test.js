import { useTestDb, api } from './helpers/setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseEnv } from '../src/config/env.js';

useTestDb();

describe('app skeleton', () => {
  it('GET /health reports ok and a connected db', async () => {
    const res = await api().get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.db, 'connected');
    assert.equal(typeof res.body.uptime, 'number');
  });

  it('unknown routes return a JSON 404', async () => {
    const res = await api().get('/definitely-not-a-route');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: 'Route not found' });
  });

  it('malformed JSON returns 400 instead of 500', async () => {
    const res = await api().post('/health').set('Content-Type', 'application/json').send('{bad json');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Malformed JSON body');
  });

  it('does not advertise the framework', async () => {
    const res = await api().get('/health');
    assert.equal(res.headers['x-powered-by'], undefined);
  });
});

describe('config', () => {
  it('rejects a missing JWT_SECRET with a readable message', () => {
    assert.throws(() => parseEnv({ MONGODB_URI: 'mongodb://x' }), /JWT_SECRET/);
  });

  it('rejects a short JWT_SECRET', () => {
    assert.throws(() => parseEnv({ MONGODB_URI: 'mongodb://x', JWT_SECRET: 'short' }), /at least 16/);
  });

  it('parses list settings and applies defaults', () => {
    const cfg = parseEnv({
      MONGODB_URI: 'mongodb://x',
      JWT_SECRET: 'x'.repeat(20),
      ADMIN_EMAILS: ' A@b.com, c@d.com ',
      CORS_ORIGINS: 'http://a, http://b',
    });
    assert.deepEqual(cfg.ADMIN_EMAILS, ['a@b.com', 'c@d.com']);
    assert.deepEqual(cfg.CORS_ORIGINS, ['http://a', 'http://b']);
    assert.equal(cfg.PORT, 5000);
    assert.equal(cfg.JWT_EXPIRES_IN, '7d');
    assert.equal(cfg.NODE_ENV, 'development');
  });
});
