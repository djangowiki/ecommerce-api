const express = require('express');

// Init Router.
const router = express.Router();

// Load Auth controllers.
const { register, login, getMe } = require('../controllers/auth');

// Protect.
const { protect } = require('../middlewares/protect');

// Auth Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);

module.exports = router;
