const express = require('express');

// Init Router.
const router = express.Router();

// Load Auth controllers.
const { register } = require('../controllers/auth');

// Auth Routes
router.route('/register').post(register);

module.exports = router;
