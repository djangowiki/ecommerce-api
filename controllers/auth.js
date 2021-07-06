const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../helpers/errorResponse');
const User = require('../models/User');
const sendEmail = require('../helpers/sendEmail');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res, next) => {
  // Check for user.
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new ErrorResponse('User already exists', 400));
  }
  // Create and save user to the database.
  user = await User.create(req.body);
  // Send Jwt tokens for accessing protected routes
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  // Validate user inputs
  if (!req.body.password || !req.body.email) {
    return next(new ErrorResponse('Enter Email and Password', 400));
  }
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );
  // Check if user exists
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Check if user password is correct
  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Send Jwt token that contains all user data.
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  // Fetch logged in user through the data in the token in the header
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Check for user.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse('User does not have an account with us', 404)
    );
  }
  // If the user exists, we get a token for password reset and save it.
  try {
    const token = user.getResetPasswordToken();
    // Save the user
    await user.save({ validateBeforeSave: false });
    const resetLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetpassword/${token}`;
    const message = `You got this email because you or someone you know requested to change
    your password. Please make a put request to the following link: ${resetLink}`;
    // Send Reset Password Email
    sendEmail({
      email: req.body.email,
      subject: 'Password Reset Request',
      message,
    });
    res.status(200).json({ success: true, data: 'Email Sent!' });
  } catch (err) {
    console.error(err.message);
    user.PasswordResetToken = undefined;
    user.PasswordResetExpire = undefined;
    return next(new ErrorResponse('Server Error', 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Fetch the password reset token and use it to get the user.
  const PasswordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // Fetch a user with the correct token and the time has not expired.
  const user = await User.findOne({
    PasswordResetToken,
    PasswordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Token is invalid', 400));
  }
  // Reset Password.
  user.password = req.body.password;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpire = undefined;
  // save user.
  await user.save();
  sendTokenResponse(user, 200, res);
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  // Check for password fields.
  if (!req.body.password || !req.body.oldPassword) {
    return next(
      new ErrorResponse('Please Enter your old password and your new password')
    );
  }
  // Fetch a user and compare the current password
  const user = await User.findById(req.user).select('+password');
  const oldPassword = req.body.oldPassword;
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Your old password is wrong.', 400));
  }
  // Set new password
  user.password = req.body.password;
  await user.save();
  res
    .status(200)
    .json({ success: true, data: 'Password changed successfully' });
});

// Send Jwt token function
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.signJwtToken();
  res.status(statusCode).json({ success: true, token });
};
