const asyncHandler = require('../middlewares/async');
const Category = require('../models/Category');
const slugify = require('../helpers/slugify');
const ErrorResponse = require('../helpers/errorResponse');
const User = require('../models/User');

exports.addProductCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const slug = slugify(name);
  const category = await Category.create({ name, description, slug });
  res.status(201).json({ success: true, data: category });
  next();
});

exports.listProductCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res
    .status(200)
    .json({ success: true, count: categories.length, data: categories });
  next();
});

exports.deleteProductCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse('Category already deleted', 404));
  }
  await Category.findByIdAndRemove(req.params.id);
  res.status(200).json({ success: true, data: {} });
  next();
});

exports.updateProductCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse('Category does not exist', 404));
  }
  const { name, description } = req.body;
  const slug = slugify(req.body.name);
  category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description, slug },
    {
      new: true,
      runValidators: false,
    }
  );
  res.status(200).json({ success: true, data: category });
});

exports.users = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
  next();
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse('User already deleted or does not exist', 404)
    );
  }
  await user.remove();
  res.status(200).json({ success: true, data: {} });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User does not exists', 404));
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: false,
    new: true,
  });
  res.status(200).json({ success: true, data: user });
});
