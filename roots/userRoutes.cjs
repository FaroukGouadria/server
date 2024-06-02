// api/routes/userRoutes.js update profile
const express = require('express');
const router = express.Router();
const {updateUserProfile} = require('../controllers/ProfileController.cjs');
const authMiddleware = require('../MiddleWares/Auth.cjs');

router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
