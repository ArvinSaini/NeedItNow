import { ApiError } from '../utils/ApiError.js';

const formatIssues = (issues) => issues.map((i) => ({ field: i.path.join('.') || 'body', message: i.message }));

/**
 * validate({ body?, query?, params? }) with zod schemas.
 * Parsed values land on req.validated.{body,query,params}. Zod objects strip unknown keys,
 * which is our mass-assignment guard: handlers only ever see whitelisted fields.
 */
export function validate(schemas) {
  return (req, res, next) => {
    const validated = {};
    for (const key of ['params', 'query', 'body']) {
      if (!schemas[key]) continue;
      const result = schemas[key].safeParse(req[key] ?? {});
      if (!result.success) {
        return next(ApiError.badRequest('Validation failed', { details: formatIssues(result.error.issues) }));
      }
      validated[key] = result.data;
    }
    req.validated = validated;
    next();
  };
}
