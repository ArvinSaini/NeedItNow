const express = require("express");
const { isAdmin } = require("../middleware/auth");
const {
    handleGetAllUsers,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
    handleGetAllListingsAdmin,
    handleDeleteListingAdmin,
    handleGetAllRequestsAdmin,
    handleDeleteRequestAdmin,
} = require("../controllers/admin");
const router = express.Router();
  
// Apply admin middleware to all routes


router.use(isAdmin);

// User Management
router.get('/users', handleGetAllUsers);
router.put('/users/:userId/block', handleBlockUser);
router.put('/users/:userId/unblock', handleUnblockUser);
router.delete('/users/:userId', handleDeleteUser);

// Listing Management
router.get('/listings', handleGetAllListingsAdmin);
router.delete('/listings/:listingId', handleDeleteListingAdmin);

// Request Management
router.get('/requests', handleGetAllRequestsAdmin);
router.delete('/requests/:requestId', handleDeleteRequestAdmin);

module.exports = router;
