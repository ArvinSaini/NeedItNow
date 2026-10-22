# NeedItNow

A hostel marketplace where students list items to lend or sell and post requests for things they need.

**Live:** https://red-water-0d9f5f500.6.azurestaticapps.net

## Repository layout

| Folder | What it is |
| --- | --- |
| `Frontend-v2/` | The live frontend. Vite, React 19, Tailwind CSS v4, react-router v7, framer-motion |
| `Backend-v2/` | The live API. Express 5, Mongoose (MongoDB), JWT auth, zod validation, rate limiting, tests |
| `Backend/` | The original API, kept for reference only |
| `Frontend/` | The original frontend, kept for reference only |
| `docs/` | MongoDB lecture notes |

## Running locally

Backend:

```bash
cd Backend-v2
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev            # or npm run dev:memory for an in-memory database
```

Frontend:

```bash
cd Frontend-v2
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev            # http://localhost:5173
```

## Deployment

GitHub Actions deploy on every push to `main`: `Frontend-v2` to Azure Static Web Apps and `Backend-v2` to Azure App Service.
