const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const historyRepository = require("./../repository/history.repository");
const surahRepository = require("./../repository/quran.reqository");

exports.createHistory = catchAsync(async (req, res, next) => {
  const { type, surahID } = req.body;
  if (!type || !surahID) {
    return next(new AppError("type or surah not found", 400));
  }
  const surah = await surahRepository.getSurahById(surahID);
  if (!surah) return next(new AppError("surah not found with that id", 400));

  const userID = req.user.id;
  const newHistory = await historyRepository.createHistory(
    surahID,
    type,
    userID
  );
  res.status(200).json({
    status: "success",
    data: newHistory,
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const history = await historyRepository.getHistory(userId);
  res.status(200).json({
    status: "success",
    data: history,
  });
});
