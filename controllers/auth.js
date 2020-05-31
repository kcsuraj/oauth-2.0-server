const Router = require("express");
const AuthCode = require("../models/authCode");
const Client = require("../models/client");
const Token = require("../models/token");
const RefreshToken = require("../models/refreshToken");
const IdToken = require("../models/idToken");
const authError = require("../errors/authError");

const getAuthorization = (req, res, next) => {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope, //Tells Service Provider which attributes the Consumer is allowed to access
    state,
  } = req.query;

  if (!responseType) {
    throw new authError("invalid_request", "Missing param: response_type");
  }

  if (responseType !== "code") {
    throw new authError("invalid_request", "Response type is not supported");
  }

  if (!clientId) {
    throw new authError("invalid_request", "Client Id is missing");
  }

  // if (!scope || scope.indexOf("openid") < 0) {
  //   throw new authError(
  //     "invalid_scope",
  //     "Scope is missing or not well defined"
  //   );
  // }

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
        return next(new authError("invalid_request", "Client does not exist"));
      }

      if (scope !== client.scope) {
        return next(
          new authError("invalid_scope", "Scope is missing or not well defined")
        );
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

      res.json(response);
    }
  );
};

const getToken = (req, res) => {
  const {
    grant_type: grantType,
    code: authCode,
    redirect_uri: redirectUri,
    client_id: clientId,
  } = req.body;

  if (!grantType) {
    // No grant type passed - Cancel the request
    throw new authError("invalid_request", "Missing parameter: grant_type");
  }

  if (grantType === "authorization_code") {
    AuthCode.findOne(
      {
        code: authCode,
      },
      (err, code) => {
        let response;

        if (err) {
          next(err);
        }

        if (!code) {
          throw new authError(
            "invalid_grant",
            "No valid authorization code provided"
          );
        }
        if (code.consumed) {
          throw new authError("invalid_grant", "Authorization code expired");
        }

        code.consumed = true;
        code.save();
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
              next(error);
              // handle error
            }
            if (!client) {
              throw new authError("invalid_request", "Client id not found");
            }

            var refreshToken = new RefreshToken({ userId: code.userId });

            refreshToken.save();

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
            next(err);
            // handle error
          }

          if (!token) {
            throw new authError("invalid_token", "Token not valid");
          }
          if (token.consumed) {
            // token got consumed already

            throw new authError("invalid_grant", "Code expired");
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
};

const createClient = (req, res, next) => {
  const client = new Client({
    name: "Suraj",
    userId: 1,
    redirectUri: "http://localhost:5200",
    scope: "openid",
  });

  client.save((err) => {
    if (err) {
      next(new Error("Client name exists already"));
    } else {
      res.json(client);
    }
  });
};

module.exports = {
  getAuthorization,
  getToken,
  createClient,
};
