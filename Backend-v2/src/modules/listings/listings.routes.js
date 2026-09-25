import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import {
  createListingSchema,
  updateListingSchema,
  listListingsQuery,
  listingIdParams,
  ownerIdParams,
} from './listings.validation.js';
import * as controller from './listings.controller.js';

export const listingsRouter = Router();

listingsRouter.get('/', validate({ query: listListingsQuery }), controller.list);
listingsRouter.get('/owner/:ownerId', validate({ params: ownerIdParams }), controller.listByOwner);
listingsRouter.get('/:id', validate({ params: listingIdParams }), controller.get);
listingsRouter.post('/', requireAuth, validate({ body: createListingSchema }), controller.create);
listingsRouter.put('/:id', requireAuth, validate({ params: listingIdParams, body: updateListingSchema }), controller.update);
listingsRouter.delete('/:id', requireAuth, validate({ params: listingIdParams }), controller.remove);
