import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAdmin } from '../../middleware/auth.js';
import { idParams } from '../../utils/objectId.js';
import * as controller from './admin.controller.js';

export const adminRouter = Router();

// Every admin route is admin-gated; the DB role is checked on each request, not the token's claim.
adminRouter.use(requireAdmin);

adminRouter.get('/users', controller.users);
adminRouter.put('/users/:userId/block', validate({ params: idParams('userId') }), controller.blockUser);
adminRouter.put('/users/:userId/unblock', validate({ params: idParams('userId') }), controller.unblockUser);
adminRouter.delete('/users/:userId', validate({ params: idParams('userId') }), controller.deleteUser);

adminRouter.get('/listings', controller.listings);
adminRouter.delete('/listings/:listingId', validate({ params: idParams('listingId') }), controller.deleteListing);

adminRouter.get('/requests', controller.requests);
adminRouter.delete('/requests/:requestId', validate({ params: idParams('requestId') }), controller.deleteRequest);
