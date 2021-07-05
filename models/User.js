const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please Enter your First Name'],
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, 'Please Enter your Last Name'],
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please Enter your Email Address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please Enter your Password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  PasswordResetToken: String,
  PasswordResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Hash password before save.
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT.
UserSchema.methods.signJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

// Match password.
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('users', UserSchema);
