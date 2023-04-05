const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const favoritesRepository = require("../repository/favorites.repository");

exports.SendFavorite = catchAsync(async (req, res, next) => {
  const { surahId } = req.body;
  const userId = req.user._id;
  if (!surahId) return next(new AppError("suarhId not found", 404));

  const existingFavorites = await favoritesRepository.getFavoriteSurah(
    userId,
    surahId
  );

  if (existingFavorites)
    return next(
      new AppError(
        "you already favorite this surah or this surah is not found",
        400
      )
    );

  const favSurah = await favoritesRepository.createFavoriteSurah(
    surahId,
    userId
  );

  res.status(200).json({
    status: "success",
    data: favSurah,
  });
});

exports.getFavoritesSurahs = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const favSurah = await favoritesRepository.getFavoriteSurahs(userId);

  res.status(200).json({
    status: "success",
    data: favSurah,
  });
});

exports.deleteFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { id: surahId } = req.params;
  const favorite = await favoritesRepository.getFavoriteSurah(userId, surahId);

  if (!favorite)
    return next(
      new AppError(
        "you not favorite this surah or this surah is not found",
        400
      )
    );

  await favoritesRepository.deleteFavorite(userId, surahId);

  res.status(200).json({
    status: "success",
    message: "favorite delete successfully",
    data: favorite,
  });
});
