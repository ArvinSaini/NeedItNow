const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { 
    handleCreateListing, 
    handleGetAllListings, 
    handleGetListing,
    handleUpdateListing,
    handleDeleteListing,
    handleGetListingsByOwner 
} = require("../controllers/product");
const router = express.Router();

router.post('/', verifyToken, handleCreateListing);
router.get('/', handleGetAllListings);
router.get('/owner/:ownerId', handleGetListingsByOwner);
router.get('/:id', handleGetListing);
router.put('/:id', verifyToken, handleUpdateListing);
router.delete('/:id', verifyToken, handleDeleteListing);

module.exports = router;
