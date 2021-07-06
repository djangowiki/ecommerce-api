const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please add a product category'],
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    slug: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('category', CategorySchema);
