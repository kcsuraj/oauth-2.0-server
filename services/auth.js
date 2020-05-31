const Client = require("../models/client");
const AuthCode = require("../models/authCode");
const RefreshToken = require("../models/refreshToken");

function getClient(clientId) {
  return Client.findOne({ clientId });
}

function getAuthCode(code) {
  return AuthCode.findOne({ code });
}

function getRefreshToken(token) {
  return RefreshToken.findOne({ token });
}

function consumeAllTokens() {
  return RefreshToken.update(
    {
      userId: token.userId,
      consumed: false,
    },
    {
      $set: { consumed: true },
    }
  );
}

module.exports = {
  getClient,
  getAuthCode,
  getRefreshToken,
  consumeAllTokens,
};
