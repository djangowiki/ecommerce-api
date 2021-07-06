const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    },
  },
  { timestamps: true }
);

// Mongo Hook for Product Slug.
ProductSchema.pre('save', (next) => {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('products', ProductSchema);
