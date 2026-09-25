/** An error the client is allowed to see. Anything else becomes a generic 500. */
export class ApiError extends Error {
  constructor(status, message, { code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message, opts) {
    return new ApiError(400, message, opts);
  }
  static unauthorized(message = 'Authentication required', opts) {
    return new ApiError(401, message, opts);
  }
  static forbidden(message = 'You do not have permission to do that', opts) {
    return new ApiError(403, message, opts);
  }
  static notFound(message = 'Not found') {
    return new ApiError(404, message);
  }
  static conflict(message) {
    return new ApiError(409, message);
  }
}
