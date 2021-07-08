const express = require('express');

const router = express.Router();

// Load controllers.
const { Products } = require('../controllers/products');

// Protect.
const { protect, authorize } = require('../middlewares/protect');

// Routes.
router.route('/').get(protect, authorize('admin'), Products);

module.exports = router;
