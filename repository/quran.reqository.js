const Surah = require("../model/surahsModel");
const Ayahs = require("../model/ayahsModel");

exports.getSurahs = async (filter) => {
  return await Surah.find(filter).sort({ number: 1 });
};

exports.getAyahsBySurah = async (surahID) => {
  return await Ayahs.aggregate([
    { $match: { surahID: surahID } },
    { $sort: { numberInSurah: 1 } },
    {
      $group: {
        _id: "$page",
        ayahs: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

exports.getAyahsByPage = async (page) => {
  return await Ayahs.aggregate([
    { $match: { page: +page } },
    { $sort: { numberInSurah: 1 } },
    {
      $group: {
        _id: "$page",
        ayahs: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

exports.getAyahsByJuz = async (juz) => {
  return await Ayahs.aggregate([
    { $match: { juz: +juz } },
    { $sort: { page: 1, number: 1 } },
    {
      $group: {
        _id: "$page",
        ayahs: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

exports.getSurahById = async (surahID) => {
  return await Ayahs.findById(surahID);
};
