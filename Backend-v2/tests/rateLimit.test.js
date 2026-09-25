import './helpers/env.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ipKeyGenerator } from 'express-rate-limit';
import { rateLimitKey } from '../src/middleware/rateLimit.js';

describe('rateLimitKey', () => {
  it('strips a trailing IPv4 port so the same host shares one bucket', () => {
    assert.equal(rateLimitKey({ ip: '1.2.3.4:5678' }), rateLimitKey({ ip: '1.2.3.4' }));
  });

  it('leaves an IPv6 address unaffected by the IPv4 port-strip', () => {
    const ip = '2001:db8::1';
    assert.equal(rateLimitKey({ ip }), ipKeyGenerator(ip));
  });
});
