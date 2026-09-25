import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { config } from '../config/env.js';

const IPV4_WITH_PORT = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):\d+$/;

/**
 * Azure App Service puts `ip:port` in X-Forwarded-For / req.ip for IPv4 clients, which would
 * otherwise give every request from the same host its own rate-limit bucket. Strip a trailing
 * IPv4 port before handing the address to express-rate-limit's own key generator (it also
 * normalizes IPv6 addresses to a subnet, per the docs' recommendation not to key on raw req.ip).
 */
export function rateLimitKey(req) {
  const ip = req.ip || '';
  const match = ip.match(IPV4_WITH_PORT);
  return ipKeyGenerator(match ? match[1] : ip);
}

const common = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  skip: () => config.NODE_ENV === 'test',
  keyGenerator: rateLimitKey,
};

/** Whole API: 300 requests per 15 minutes per IP. */
export const globalLimiter = rateLimit({ ...common, limit: 300 });

/** Login, signup, password change: 20 per 15 minutes per IP (brute-force protection). */
export const authLimiter = rateLimit({ ...common, limit: 20, skipSuccessfulRequests: true });
