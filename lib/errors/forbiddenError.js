const HttpStatus = require("http-status-codes");

function forBiddenError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.statusCode = HttpStatus.FORBIDDEN;
  this.message = message;
}

util.inherits(forBiddenError, Error);

module.exports = forBiddenError;
