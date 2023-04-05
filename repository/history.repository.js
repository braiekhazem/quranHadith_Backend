const History = require("./../model/history");

exports.createHistory = async (surahID, type, userID) => {
  return await History.create({ surahID, userID, type });
};

exports.getHistory = async (userID) => {
  return await History.find({ userID }).populate("surahID");
};
