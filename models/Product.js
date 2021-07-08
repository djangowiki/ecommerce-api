const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    slug: String,
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sku: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('products', ProductSchema);
