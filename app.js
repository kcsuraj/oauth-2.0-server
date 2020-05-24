const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const constants = require("./utils/constants");
const AuthCode = require("./lib/models/authCode");
const Client = require("./lib/models/client");
const Token = require("./lib/models/token");
const RefreshToken = require("./lib/models/refreshToken");
const IdToken = require("./lib/models/idToken");
const authorize = require("./lib/middlewares/authorize");
const authError = require("./lib/errors/authError");
const handleError = require("./lib/middlewares/handleError");

// Create Express server
const app = express();

// configure app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add HTTP request logger
app.use(morgan("combined"));

// Connect to MongoDB database
mongoose
  .connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
  });

app.get("/authorize", (req, res, next) => {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope, //Tells Service Provider which attributes the Consumer is allowed to access
    state,
  } = req.query;

  if (!responseType) {
    // Cancel the request - Missed the response type
    throw new authError("invalid_request", "Missing param: response_type");
  }

  if (responseType !== "code") {
    //   Notify the user about an unspupported response type
  }

  if (!clientId) {
    //   cancel the request - Client id is missing
  }

  if (!scope || scope.indexOf("openid") < 0) {
    //  Scope is missing or not well defined
    console.log(" ===> scope missing");
  }

  // Mongoose model - consists of an id, secret, user ID and other attributes like redirectURI
  Client.findOne(
    {
      clientId,
    },
    (err, client) => {
      if (err) {
        //   handle error by passing to the middleware
        next(err);
      }

      if (!client) {
        //   cancel the request - cient does not exist
      }

      if (scope !== client.scope) {
        //   scope is missing or not well defined
      }

      const authCode = new AuthCode({
        clientId,
        userId: client.userId,
        redirectUri,
      });

      authCode.save();

      const response = {
        state,
        code: authCode.code,
      };

      if (redirectUri) {
        const redirect = `${redirectUri}?code=${response.code}&state=${
          state === undefined ? "" : state
        }`;
        // res.redirect(redirect);
        res.json(response);
      } else {
        res.json(response);
      }
    }
  );
});

app.post("/token", (req, res) => {
  const {
    grant_type: grantType,
    code: authCode,
    redirect_uri: redirectUri,
    client_id: clientId,
  } = req.body;

  if (!grantType) {
    // No grant type passed - Cancel the request
    return errorHandler(
      new authError("invalid_request", "Missing parameter: grant_type"),
      res
    );
  }

  if (grantType === "authorization_code") {
    AuthCode.findOne(
      {
        code: authCode,
      },
      (err, code) => {
        let response;

        if (err) {
          // handle error
        }

        if (!code) {
          // No valid authorization code provided
        }
        if (code.consumed) {
          return errorHandler(
            new authError("invalid_grant", "Authorization Code expired"),
            res
          );
        }

        // code.consumed = true;
        // code.save();
        // if (code.redirectUri !== redirectUri) {
        // cancel the request
        // }

        // Validate client id
        Client.findOne(
          {
            clientId,
          },
          (error, client) => {
            if (error) {
              // handle error
            }
            if (!client) {
              // client id provided does not exist
            }

            const token = new Token({
              refreshToken: refreshToken.token,
              userId: code.userId,
            });

            token.save();

            if (client.scope && client.scope.indexOf("openid") >= 0) {
              const idToken = new IdToken({
                iss: client.redirectUri,
                aud: client.clientId,
                userId: code.userId,
              });

              idToken.save();

              response = {
                access_token: token.accessToken,
                refreshToken: token.refreshToken,
                id_token: idToken.sub,
                expires_in: token.expiresIn,
                token_type: token.tokenType,
              };
            } else {
              const refreshToken = new RefreshToken({
                userId: code.userId,
              });
              refreshToken.save();

              response = {
                access_token: token.accessToken,
                refresh_token: token.refreshToken,
                expires_in: token.expiresIn,
                tokenType: token.tokenType,
              };
            }

            res.json(response);
          }
        );
      }
    );
  } else if (grantType === "refresh_token") {
    if (!refreshToken) {
      // no refresh token provided - cancel
      RefreshToken.findOne(
        {
          token: refreshToken,
        },
        (err, token) => {
          if (err) {
            // handle error
          }

          if (!token) {
            // no refresh token found
          }
          if (token.consumed) {
            // token got consumed already
          }

          // Consuem all previous refresh tokens
          RefreshToken.update(
            {
              userId: token.userId,
              consumed: false,
            },
            {
              $set: { consumed: true },
            }
          );

          const refreshToken = new RefreshToken({
            userId: token.userId,
          });

          refreshToken.save();

          const newToken = new Token({
            refreshToken: refreshToken.token,
            userId: token.userId,
          });
          token.save();

          const response = {
            access_token: newToken.accessToken,
            refresh_token: newToken.refreshToken,
            expires_in: newToken.expiresIn,
            token_type: newToken.tokenType,
          };

          // send new token to consumer
          res.json(response);
        }
      );
    }
  }
});

app.get("/", (req, res, next) => {
  const client = new Client({
    name: "Suraj",
    userId: 1,
    redirectUri: "http://localhost:5000",
    scope: "read",
  });

  client.save((err) => {
    if (err) {
      next(new Error("Client name exists already"));
    } else {
      res.json(client);
    }
  });
});

app.get("/userInfo", authorize, (req, res) => {
  //
});

// app.use((req, res, next) => {
//   const error = new Error("Not Found!");
//   error.status = 404;
//   next(error);
// });

app.use(handleError);

app.set("port", process.env.PORT || 5200);

module.exports = app;
