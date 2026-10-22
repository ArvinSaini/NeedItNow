# NeedItNow Backend v2

Express 5 + Mongoose 9 API for the NeedItNow hostel marketplace. Drop-in replacement for the legacy `Backend/`: same paths and response shapes, so the deployed `Frontend-v2` needs no changes.

## Run

```bash
npm install
cp .env.example .env        # fill in MONGODB_URI and JWT_SECRET
npm run dev                 # nodemon, http://localhost:5000
npm run dev:memory          # no database needed: in-memory MongoDB, admin@test.com becomes admin
npm test                    # node:test + supertest + in-memory MongoDB
npm run lint
```

Requires Node 24 LTS (`.nvmrc`). Node 22 also works.

## Architecture

```
src/
  server.js          boot: validate config → connect MongoDB → listen → graceful shutdown
  app.js             createApp(): middleware, routers, 404, error handler (no listen → testable)
  config/            env.js (zod-validated env, fails fast), constants.js (enums, limits, PUBLIC_USER_FIELDS)
  db/                connect.js (connects, sets strictQuery)
  middleware/        auth (requireAuth, requireAdmin), validate (zod), rateLimit, errorHandler
  utils/             ApiError, objectId, escapeRegex, fields (shared zod field schemas: title, description, category)
  modules/
    users/           user.model, users.service, password.js (the only file that touches passwords)
    auth/            signup, login, me, change password, public profile
    listings/        model, validation, controller, service, routes
    requests/        model, validation, controller, service, routes
    admin/           user/listing/request management
```

**Feature modules, layered inside.** Each module owns its routes, validation schema, controller, service and model. Cross-cutting concerns live once at the `src/` level. Fields shared between listings and requests (`title`, `description`, `category`) live once in `src/utils/fields.js` instead of being duplicated per module.

**Request lifecycle:** helmet → cors → json (50 kb) → morgan → global rate limit → router → [auth limiter] → [requireAuth / requireAdmin] → validate → controller → service → model. Any thrown error (including a rejected promise — Express 5 forwards those automatically) reaches `errorHandler`.

`requireAdmin` is not a single function: it's the array `[requireAuth, adminOnly]`, mounted directly as router middleware (`adminRouter.use(requireAdmin)`). Express expands an array of middleware in place, so this runs `requireAuth` (verify JWT, re-read the user) and then the role check, both handled by Express 5's native async-rejection forwarding — no wrapper needed.

| Layer | Responsibility | Never does |
|---|---|---|
| Routes | declare the HTTP surface, order the middleware | logic |
| Validation (zod) | trust boundary: parse, strip unknown keys, 400 with `details` | DB access |
| Controller | read `req.validated` / `req.user`, call one service, send response | DB access, business rules |
| Service | business rules: ownership, status, cascades, tokens; throws `ApiError` | touch `req`/`res` |
| Model | schema, indexes, serialization (`toJSON` strips `password`) | business rules |

## Security decisions

- **Validation as the trust boundary.** Zod object schemas strip unknown keys, so `owner`, `role`, `isBlocked` in a request body are ignored (no mass assignment) and every value that reaches Mongoose is a plain string. That plain-string coercion is also what closes the classic `{ "password": { "$ne": "" } }` login-bypass hole: `login` looks a user up by email only and compares the password in application code (`password.js`), so an object can never reach a query operator position. `strictQuery` (set in `db/connect.js`) only drops *unknown* filter fields — it doesn't stop operators on real schema paths, so it isn't relied on for this. A global `mongoose.set('sanitizeFilter', true)` was deliberately not used either: it would also mangle services' own trusted `$in` filters (e.g. the hostel lookup in listings).
- **Auth re-reads the user.** `requireAuth` verifies the JWT (`sub`, `role`, 7 days) and then loads the user, so blocking is immediate and a forged role claim is ignored. Error codes (`TOKEN_MISSING`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `USER_NOT_FOUND`, `ACCOUNT_BLOCKED`) let the frontend log the user out cleanly.
- **Ownership in services.** Update/delete first load the document and compare `owner`/`requester` with `req.user.id`; mismatch → 403.
- **Passwords.** Stored as-is **by owner decision (2026-09-25)**; see `src/modules/users/password.js`. The field is `select: false` and stripped from `toJSON`, so it never leaks. Verification uses a constant-time compare. A wrong current password on `PUT /user/password` returns 400 `WRONG_PASSWORD` (not 401), so the frontend never mistakes it for a dead session. Switching to bcrypt is a two-function change in that file.
- **Legacy rows stay editable.** Updates save with `{ validateModifiedOnly: true }` (listings, requests, password changes), so a pre-existing document with a field outside today's stricter limits (e.g. a long legacy description) isn't blocked from being saved — only the fields actually being changed are revalidated.
- **Abuse limits.** helmet headers, CORS allow-list (`CORS_ORIGINS`), 300 req/15 min per IP globally, 20 req/15 min on login/signup/password, 50 kb bodies, field length caps (title 80, description 500).
- **Search is regex-escaped** and capped at 100 chars.
- **Errors never leak internals.** Stable JSON shape `{ error, code?, details? }`; 500s are logged server-side only.
- **Boot safety.** Missing/short `JWT_SECRET` or missing `MONGODB_URI` stops the process before it listens.

## API

Legacy paths (`/user`, `/product`, `/request`, `/admin`) and `/api/v1/{auth,listings,requests,admin}` serve the same routers. Also `GET /health`.

New in v2: `GET /user/me`, `PUT /user/password` (`{ currentPassword, newPassword }` → 200 `{ message }` or 400 `WRONG_PASSWORD`), `GET /user/:id` now requires auth and returns only public profile fields, no email (`PUBLIC_PROFILE_FIELDS` in `src/modules/users/users.service.js`: name, hostel, roomNumber, phone).

## Environment

| Var | Required | Notes |
|---|---|---|
| `MONGODB_URI` | yes | |
| `JWT_SECRET` | yes | ≥16 chars |
| `PORT` | no | default 5000 (Azure sets it) |
| `NODE_ENV` | no | development / test / production |
| `JWT_EXPIRES_IN` | no | default `7d` |
| `ADMIN_EMAILS` | no | comma-separated; promoted at signup |
| `CORS_ORIGINS` | no | comma-separated; empty allows all (warns) |

## Deploying to Azure (current state)

`.github/workflows/cicd.yml` deploys **this** package (`Backend-v2`) to Azure App Service on every push to `main`: Node 24, `npm ci --omit=dev` in `Backend-v2`, `package: Backend-v2`. The legacy `Backend/` is no longer deployed by CI; it stays in the repo untouched for reference.

**Remaining Azure-side checks (App Service configuration, not code):**

- Stack settings: **Node 24 LTS** (Node ≥22 also works). Startup Command can be left empty (uses `npm start`) or set to `node index.js` — both boot the same server (`index.js` is a one-line shim to `src/server.js`, kept for hosts still configured to run it from the legacy backend).
- App settings: `JWT_SECRET` (≥16 chars — v2 refuses to boot otherwise), `MONGODB_URI`, `ADMIN_EMAILS`, optional `CORS_ORIGINS=https://<frontend-host>`.
- Every signed-in user is logged out once at the switch: legacy tokens carry `userId`, not `sub`, so v2 rejects them with 401 `TOKEN_INVALID` and Frontend-v2 shows its "session expired" banner. This is expected, one-time, and needs no user communication beyond that banner.
- Verify `req.ip` on the App Service actually resolves to the client's real address (not the load balancer's) — Azure's proxy setup can vary; check a live rate-limit response's key behavior if in doubt.
- The global limiter is 300 requests per 15 minutes **per IP**. A whole hostel behind one NAT/router shares that budget. Watch for 429s clustering from a single hostel IP and raise the limit if students hit it.

**Mixed-case legacy emails:** the legacy backend stored emails exactly as typed; v2 lowercases email on input and looks up by exact match, and the frontend now lowercases the email field as the user types. Any legacy account with uppercase letters in its stored email can no longer log in under v2. By owner decision, these accounts are not migrated — the owner will delete them directly rather than run a lowercase migration. To list them first:

```js
db.users.find({ email: /[A-Z]/ });
```

## Interview notes

- *Why feature modules?* A feature's code changes together, so it lives together; shared concerns are cross-cutting and live once.
- *Why is `createApp` separate from `server.js`?* Tests import the app without opening a port or reading `.env`.
- *Why re-read the user on every request if JWT is stateless?* One indexed `findById` buys immediate blocking and un-forgeable roles; a hostel app's traffic makes that trade obvious.
- *What would you change next?* Hash passwords (one file), refresh tokens, pagination, image uploads.

## Deferred (documented, not forgotten)

- Password hashing (owner decision; seam ready in `password.js`).
- Forgot-password by email; admin-triggered reset.
- Pagination.
