const Router = require("express");
const {
  getAuthorization,
  getToken,
  createClient,
} = require("./controllers/auth");

const routes = Router();

// Get token to acceess protected resources
routes.post("/token", getToken);

// Get Authorization code
routes.get("/authorize", getAuthorization);

// Create a sample client for authorization
routes.get("/client", createClient);

// !TODO create route to get user profile as per OpenID standard
// routes.get("/userInfo", authorize, (req, res) => {
// });

module.exports = routes;
