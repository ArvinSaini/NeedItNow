const express = require("express");
const { handleUserSignup, handleUserLogin, handleGetUser, handleGetMe } = require("../controllers/user");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
// Must come before '/:id' or a request for '/me' would be captured as id === 'me'.
router.get('/me', verifyToken, handleGetMe);
router.get('/:id', handleGetUser);

module.exports = router;
