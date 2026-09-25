export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net';

/* Backend error codes that mean "this session is dead" (Backend-v2 src/middleware/auth.js) */
const SESSION_END_REASONS = {
  TOKEN_MISSING: 'expired',
  TOKEN_INVALID: 'expired',
  TOKEN_EXPIRED: 'expired',
  USER_NOT_FOUND: 'expired',
  ACCOUNT_BLOCKED: 'blocked',
};

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/* Clears the session and sends the user to the login page with an explanation banner. */
export function endSession(reason) {
  clearSession();
  window.location.assign(`/login?reason=${reason}`);
}

export async function apiFetch(path, { auth = false, method = 'GET', body, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response body */
  }
  if (!res.ok) {
    // Also treat any 401 on an authenticated call as an expired session even when there is
    // no code (the deployed legacy backend sends 401 with no code).
    const reason = auth && (SESSION_END_REASONS[data.code] || (res.status === 401 ? 'expired' : null));
    if (reason) endSession(reason);
    let message = data.error || data.message || `Request failed (${res.status})`;
    // Backend-v2 sends the generic "Validation failed" plus a details array; surface the
    // first field-level message instead so the user sees something actionable.
    if (data.error === 'Validation failed' && Array.isArray(data.details) && data.details[0]?.message) {
      const detail = data.details[0];
      message = detail.field ? `${detail.field}: ${detail.message}` : detail.message;
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}
