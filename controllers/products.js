const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');
const slugify = require('../helpers/slugify');

exports.Products = asyncHandler(async (req, res, next) => {
  const products = await Product.find().populate(
    'category',
    'name description slug'
  );
  res.status(200).json({ success: true, data: products });
});

exports.addProduct = asyncHandler(async (req, res, next) => {
  const slug = slugify(req.body.title);
  const product = await Product.create({ data: req.body, slug });
});
