import { defineConfig, devices } from '@playwright/test';

const API = 'http://localhost:5000';
const APP = 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: APP,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  // Never reuse a running server: a plain `npm run dev` would point the tests at the production API.
  webServer: [
    {
      // Fresh in-memory database every run: admin@test.com is promoted by ADMIN_EMAILS.
      command: 'npm run dev:memory',
      cwd: '../Backend-v2',
      url: `${API}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { PORT: '5000', ADMIN_EMAILS: 'admin@test.com', CORS_ORIGINS: '' },
    },
    {
      command: 'npm run dev -- --strictPort --port 5173',
      url: APP,
      reuseExistingServer: false,
      timeout: 60_000,
      env: { VITE_API_URL: API },
    },
  ],
});
