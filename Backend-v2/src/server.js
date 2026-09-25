import { config } from './config/env.js';
import { connectDb, disconnectDb } from './db/connect.js';
import { createApp } from './app.js';

async function main() {
  await connectDb(config.MONGODB_URI);
  console.log('mongodb connected');
  if (config.CORS_ORIGINS.length === 0) console.warn('CORS_ORIGINS not set: allowing all origins');

  const server = createApp().listen(config.PORT, () => {
    console.log(`api listening on port ${config.PORT} (${config.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('failed to start:', err.message);
  process.exit(1);
});
