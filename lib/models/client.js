const mongoose = require("mongoose");
const uuid = require("node-uuid");

const ClientSchema = mongoose.Schema({
  clientId: {
    type: String,
    default: uuid.v4(),
    unique: true,
  },
  clientSecret: {
    type: String,
    default: uuid.v4(),
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: { type: String, unique: true },
  scope: { type: String },
  userId: { type: String },
  redirectUri: { type: String },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
