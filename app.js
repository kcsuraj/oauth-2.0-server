const express = require("express");

// Create Express server
const app = express();

app.set("port", process.env.PORT || 5200);

module.exports = app;
