import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import {
  createRequestSchema,
  updateRequestSchema,
  listByUserQuery,
  requestIdParams,
  requesterIdParams,
} from './requests.validation.js';
import * as controller from './requests.controller.js';

export const requestsRouter = Router();

requestsRouter.get('/', controller.list);
requestsRouter.get('/user/:userId', validate({ params: requesterIdParams, query: listByUserQuery }), controller.listByUser);
requestsRouter.get('/:id', validate({ params: requestIdParams }), controller.get);
requestsRouter.post('/', requireAuth, validate({ body: createRequestSchema }), controller.create);
requestsRouter.put('/:id', requireAuth, validate({ params: requestIdParams, body: updateRequestSchema }), controller.update);
requestsRouter.delete('/:id', requireAuth, validate({ params: requestIdParams }), controller.remove);
