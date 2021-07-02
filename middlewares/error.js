const ErrorResponse = require('../helpers/errorResponse');

const errorHandler = (err, req, res, next) => {
  // Dev Logging.
  console.log(err);

  // Catch Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    err = new ErrorResponse(message, 400);
    next();
  }
  // Catch CastError
  if (err.name === 'CastError') {
    err = new ErrorResponse(
      `Resource with the id ${err.value} does not exists`,
      404
    );
    next();
  }
  // Catch Duplicate Fields Errors
  if (err.code === 11000) {
    err = new ErrorResponse('Duplicate fields error', 400);
    next();
  }
  res
    .status(err.statusCode || 500)
    .json({ success: false, errors: err.message || 'Server Error' });
};

module.exports = errorHandler;
