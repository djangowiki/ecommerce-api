const express = require('express');

const router = express.Router();

// Load admin controllers.
const {
  addProductCategory,
  listProductCategories,
  deleteProductCategory,
  updateProductCategory,
  users,
  deleteUser,
  updateUser,
} = require('../controllers/admin');

const { protect, authorize } = require('../middlewares/protect');

// Routes.
router
  .route('/category/add')
  .post(protect, authorize('admin'), addProductCategory);

router
  .route('/categories')
  .get(protect, authorize('admin'), listProductCategories);

router
  .route('/category/:id')
  .delete(protect, authorize('admin'), deleteProductCategory);

router
  .route('/category/:id')
  .put(protect, authorize('admin'), updateProductCategory);

router.route('/users').get(protect, authorize('admin'), users);
router.route('/user/:id').delete(protect, authorize('admin'), deleteUser);
router.route('/user/:id').put(protect, authorize('admin'), updateUser);
module.exports = router;
