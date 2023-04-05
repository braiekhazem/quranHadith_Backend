const express = require("express");
const quranController = require("./../controller/quranController");
const favoritesController = require("./../controller/FavoritesController");
const { protect } = require("../controller/userConroller");
const Router = express.Router();

Router.route("/").get(protect, quranController.GetQuran);
Router.route("/juz/:juz").get(protect, quranController.GetJuz);
Router.route("/bookmark")
  .post(protect, favoritesController.SendFavorite)
  .get(protect, favoritesController.getFavoritesSurahs);
Router.route("/bookmark/:id").delete(
  protect,
  favoritesController.deleteFavorites
);

module.exports = Router;
