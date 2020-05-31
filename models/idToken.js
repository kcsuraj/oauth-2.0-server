const mongoose = require("mongoose");
const uuid = require("node-uuid");

const IdTokenSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now(), expires: "1m" },
  iat: { type: String, default: Math.floor(new Date() / 1000) },
  exp: { type: String, default: Math.floor(new Date() / 1000) + 180 },
  iss: { type: String },
  aud: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("IdToken", IdTokenSchema);
