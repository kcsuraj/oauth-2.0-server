const mongoose = require("mongoose");
const uuid = require("node-uuid");

const RefreshTokenSchema = mongoose.Schema({
  userId: { type: String },
  token: { type: String, default: uuid.v4() },
  createdAt: { type: Date, default: Date.now() },
  consumed: { type: Boolean, default: false },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
