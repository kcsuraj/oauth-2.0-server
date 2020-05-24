const Token = require("../models/token");

const authorize = (req, res, next) => {
  let accessToken;

  if (req.headers.authorization) {
    //   Validate authorization header
    const parts = req.headers.authorization.split(" ");
    if (parts.length < 2) {
      // No access token provided - cancel
      res.set("WWW-AuthenticatorResponse", "Bearer");
      res.sendStatus(401);
      return;
    }

    accessToken = parts[1];
  } else {
    //   access token UI parameter or entity body
    accessToken = req.query.access_token || req.body.access_token;
  }

  if (!accessToken) {
    //   No access token provided - cancel
  }

  Token.findOne(
    {
      accessToken,
    },
    (err, token) => {
      if (err) {
        //   Handle error
      }
      if (!token) {
        //   Token does not exists
      }

      Token.update(
        {
          userId: token.userId,
          consumed: false,
        },
        {
          $set: { consumed: true },
        }
      );

      //  After this middleware has processed request, the request is passed on to the next middleware or route itself
      next();
    }
  );
};

module.exports = authorize;
