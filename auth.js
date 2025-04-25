const express = require('express');
const router = express.Router();
const { loginUser, signupUser, getAllUsers } = require('../controllers/authController');

// Auth routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

// Admin-only route to get all users
router.get('/users', getAllUsers);

module.exports = router;
