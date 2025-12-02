const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { 
    handleCreateRequest, 
    handleGetAllRequests, 
    handleGetRequest,
    handleUpdateRequest,
    handleDeleteRequest,
    handleGetRequestsByUser 
} = require("../controllers/request");
const router = express.Router();

router.post('/', verifyToken, handleCreateRequest);
router.get('/', handleGetAllRequests);
router.get('/:id', handleGetRequest);
router.put('/:id', verifyToken, handleUpdateRequest);
router.delete('/:id', verifyToken, handleDeleteRequest);
router.get('/user/:userId', handleGetRequestsByUser);

module.exports = router;
