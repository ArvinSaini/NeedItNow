const express = require("express");
const { handleUserSignup, handleUserLogin, handleGetUser } = require("../controllers/user");
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/:id', handleGetUser);

module.exports = router;
