const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const constants = require("./utils/constants");
const handleError = require("./lib/middlewares/handleError");
const routes = require("./routes");

// Create Express server
const app = express();

// configure app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add HTTP request logger
app.use(morgan("combined"));

// Connect to MongoDB database
mongoose
  .connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
  });

// Handle Auth Routes
app.use(routes);

app.use(handleError);

app.set("port", process.env.PORT || 5200);

module.exports = app;
