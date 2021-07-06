const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    enum: ['user', 'admin'],
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
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
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

// Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate a secure randombytes and convert it to a string
  const token = crypto.randomBytes(20).toString('hex');
  // Hash and pass the randombytes string to field in the database
  this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  // Set an expiry time for the hashed string
  this.PasswordResetExpire = Date.now() + 10 * 60 * 1000;
  return token;
};
module.exports = mongoose.model('users', UserSchema);
