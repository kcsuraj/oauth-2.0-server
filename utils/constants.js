const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const constants = {
  dbURI: process.env.DB_URI,
  dbName: process.env.DB_NAME,
};

module.exports = constants;
