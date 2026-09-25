import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { listingsRouter } from './modules/listings/listings.routes.js';
import { requestsRouter } from './modules/requests/requests.routes.js';

/** Builds the Express app without listening, so tests and the server share one definition. */
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Azure App Service sits behind one proxy; needed for real client IPs

  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGINS.length ? config.CORS_ORIGINS : true }));
  app.use(express.json({ limit: '50kb' }));
  if (config.NODE_ENV !== 'test') app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(globalLimiter);

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.round(process.uptime()),
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  app.use(['/user', '/api/v1/auth'], authRouter);
  app.use(['/product', '/api/v1/listings'], listingsRouter);
  app.use(['/request', '/api/v1/requests'], requestsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
