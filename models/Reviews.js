const mongoose = require('mongoose');

const ReviewsSchema = mongoose.Schema(
  {
    title: String,
    description: {
      type: String,
      required: [true, 'Please enter review description'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('review', ReviewsSchema);
