const express = require('express');
const router = express.Router();
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// GET admin profile
router.get('/profile', protectAdmin, getAdminProfile);

// UPDATE admin profile
router.put('/profile', protectAdmin, updateAdminProfile);

module.exports = router;
