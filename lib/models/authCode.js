const mongoose = require("mongoose");
const uuid = require("node-uuid");

const AuthCodeSchema = mongoose.Schema({
  code: {
    type: String,
    default: uuid.v4(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "10m",
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
  },
  redirectUri: { type: String },
});

const AuthCode = mongoose.model("AuthCode", AuthCodeSchema);

module.exports = AuthCode;
