import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import { signupSchema, loginSchema, userIdParams } from './auth.validation.js';
import * as controller from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/signup', authLimiter, validate({ body: signupSchema }), controller.signup);
authRouter.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);
authRouter.get('/me', requireAuth, controller.me);
authRouter.get('/:id', requireAuth, validate({ params: userIdParams }), controller.getUser);
