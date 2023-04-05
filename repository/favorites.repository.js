const Favorites = require("./../model/bookmarkModel");

exports.createFavoriteSurah = async (surahID, userID) => {
  return await Favorites.create({ surahID, userID });
};

exports.getFavoriteSurahs = async (userID) => {
  return await Favorites.find({ userID });
};

exports.getFavoriteSurah = async (userID, surahID) => {
  return await Favorites.findOne({ surahID, userID });
};

exports.deleteFavorite = async (userID, surahID) => {
  return await Favorites.deleteOne({ surahID, userID });
};
