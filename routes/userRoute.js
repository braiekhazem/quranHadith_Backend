const express = require("express");
const userController = require("./../controller/userConroller");
const Router = express.Router();
const passport = require("passport");

Router.route("/login").post(userController.login);
Router.route("/signup").post(userController.signup);
Router.route("/me").get(
  userController.protect,
  userController.getMe,
  userController.getUser
);
Router.route("/oauth2callback").post(userController.oauth2callback);

Router.post(
  "/signin-google",
  passport.authenticate("google-id-token", { session: false }),
  userController.login
);

module.exports = Router;
