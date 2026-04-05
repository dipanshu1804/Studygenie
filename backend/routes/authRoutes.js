const express = require('express');
const router  = express.Router();
const {
  register, login, getMe,
  updateProfile, changePassword, getUserStats,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',  register);
router.post('/login',     login);
router.get('/me',         protect, getMe);
router.patch('/profile',  protect, updateProfile);
router.patch('/password', protect, changePassword);
router.get('/stats',      protect, getUserStats);

module.exports = router;
