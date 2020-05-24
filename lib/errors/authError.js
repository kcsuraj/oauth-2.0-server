const util = require("util");

function authError(code, message, err) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.code = code;
  this.message = message;

  switch (code) {
    case "unsupported_grant_type":
      this.status = 400;
      break;
    case "invalid_grant":
      this.status = 400;
      break;
    case "invalid_request":
      this.status = 400;
      break;
    case "invalid_client":
      this.status = 401;
      break;
    case "invalid_token":
      this.status = 401;
      break;
    case "server_error":
      this.status = 503;
      break;
    default:
      // Leave all other errors to the default error handler
      this.status = 500;
      break;
  }

  return this;
}

// Inehri all error methods and properties
util.inherits(authError, Error);

module.exports = authError;
