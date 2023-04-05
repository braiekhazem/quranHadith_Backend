const express = require("express");
const { protect } = require("../controller/userConroller");
const historyController = require("../controller/historyCotroller");
const Router = express.Router();

Router.route("/")
  .get(protect, historyController.getHistory)
  .post(protect, historyController.createHistory);

module.exports = Router;
