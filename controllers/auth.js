const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../helpers/errorResponse');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
  // Check for user.
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new ErrorResponse('User already exists', 400));
  }
  user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  if (!req.body.password || !req.body.email) {
    return next(new ErrorResponse('Enter Email and Password', 400));
  }
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  // const user = await User.findById(req.user);

  res.status(200).json({ success: true, data: req.user });
});

// Send Jwt token function
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.signJwtToken();
  res.status(statusCode).json({ success: true, token });
};
