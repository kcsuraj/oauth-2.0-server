const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const constants = {
  mongoURI: process.env.MONGO_URI,
};

module.exports = constants;
