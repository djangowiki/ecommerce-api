const express = require('express');

// Init Router.
const router = express.Router();

// Load Auth controllers.
const {
  register,
  login,
  getMe,
  resetPassword,
  forgotPassword,
  changePassword,
} = require('../controllers/auth');

// Protect.
const { protect } = require('../middlewares/protect');

// Auth Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgot').post(forgotPassword);
router.route('/resetpassword/:token').post(resetPassword);
router.route('/changepassword').post(protect, changePassword);

module.exports = router;
