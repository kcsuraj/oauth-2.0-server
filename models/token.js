const mongoose = require("mongoose");
const uuid = require("node-uuid");

const TokenSchema = mongoose.Schema({
  userId: { type: String },
  refreshToken: { type: String, unique: true },
  accessToken: { type: String, default: uuid.v4() },
  tokenType: { type: String, default: "bearer" },
  expiresIn: { type: String, default: "10800" },
  consumed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now(), expires: "3m" },
});

module.exports = mongoose.model("Token", TokenSchema);
