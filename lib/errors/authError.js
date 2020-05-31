const util = require("util");
const HttpStatus = require("http-status-codes");

function authError(type, message) {
  Error.captureStackTrace(this, this.constructor);

  this.code = type;
  this.message = message;

  switch (type) {
    case "unsupported_grant_type":
    case "invalid_grant":
    case "invalid_request":
      this.statusCode = HttpStatus.BAD_REQUEST;
      break;
    case "invalid_client":
    case "invalid_token":
      this.statusCode = HttpStatus.UNAUTHORIZED;
      break;
    case "server_error":
      this.status = HttpStatus.SERVICE_UNAVAILABLE;
      break;
    default:
      // Leave all other errors to the default error handler
      this.status = HttpStatus.INTERNAL_SERVER_ERROR;
      break;
  }
}

// Inehri all error methods and properties
util.inherits(authError, Error);

module.exports = authError;
