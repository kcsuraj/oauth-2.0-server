const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const constants = {
  mongoURI: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  clientId: process.env.CLIENT_ID,
};

module.exports = constants;
