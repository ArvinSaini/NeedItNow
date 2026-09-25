import { z } from 'zod';

// Node loads .env natively (no dotenv). Missing file is fine: Azure injects app settings directly.
// Existing environment variables win over the file. Skipped in tests so tests never read a real .env.
if (process.env.NODE_ENV !== 'test') {
  try {
    process.loadEnvFile();
  } catch {
    /* no .env file */
  }
}

const csv = (value) =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAILS: z
    .string()
    .default('')
    .transform((v) => csv(v).map((e) => e.toLowerCase())),
  CORS_ORIGINS: z.string().default('').transform(csv),
});

/** Validates a raw env object. Throws a readable error listing every problem. */
export function parseEnv(source) {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ');
    throw new Error(`Invalid environment configuration:\n  ${problems}`);
  }
  return result.data;
}

export const config = parseEnv(process.env);
