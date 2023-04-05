const catchAsync = require("../utils/catchAsync");
const SaveData = require("./../utils/saveData");
const fs = require("fs");
const AppError = require("../utils/appError");
const { default: axios } = require("axios");
const quranRepository = require("./../repository/quran.reqository");
const historyRepository = require("./../repository/history.repository");

const FilterData = ({ data }) => {
  const ValuesNumbers = Object.keys(data.surahs);
  const result = ValuesNumbers.flatMap((val) =>
    data.ayahs.filter((ayah) => ayah.surah.number == val)
  ).map((val) => (val = { ...val, surah: val.surah.number }));
  return { ayahs: result, surahs: data.surahs };
};

exports.GetQuran = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const { surah, page, search, juz } = req.query;
  if (surah > 114 || surah < 1)
    return next(new AppError("surah not Found", 400));

  if (page < 1) return next(new AppError("Pgae not Found", 400));

  if (juz < 1 || juz > 30) return next(new AppError("Pgae not Found", 400));

  let filterData = {};

  if (surah) {
    filterData.number = surah;
  } else if (page) {
    filterData.page = page;
  } else if (search) {
    filterData = { ...filterData, englishName: { $regex: search } };
  } else filterData.juz = juz;

  let data = !page && !juz ? await quranRepository.getSurahs(filterData) : null;

  if (surah && data) {
    data = data[0].toObject();
    const pages = await quranRepository.getAyahsBySurah(data._id);
    data.pages = pages;
    await historyRepository.createHistory(data._id, 1, userID);
  } else if (page) {
    data = await quranRepository.getAyahsByPage(page);
  } else if (juz) {
    data = await quranRepository.getAyahsByJuz(juz);
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.GetJuz = catchAsync(async (req, res, next) => {
  const Juz = +req.params.juz;
  if (Juz > 30 || Juz < 1) return next(new AppError("Juz Not Found", 404));
  const data = await axios.get(
    `http://api.alquran.cloud/v1/juz/${Juz}/ar.asad`
  );
  FilterData(data.data);
  res.status(200).json({
    status: "success",
    data: FilterData(data.data),
  });
});
