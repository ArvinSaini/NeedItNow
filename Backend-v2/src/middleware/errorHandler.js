import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

// Express recognises an error handler by its four parameters, so `next` must stay.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.code && { code: err.code }),
      ...(err.details && { details: err.details }),
    });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body too large' });
  if (err.name === 'CastError') return res.status(400).json({ error: `Invalid ${err.path}` });
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    return res.status(409).json({ error: `${field} already exists` });
  }
  if (config.NODE_ENV !== 'test') console.error(err);
  return res.status(500).json({ error: 'Something went wrong' });
}
