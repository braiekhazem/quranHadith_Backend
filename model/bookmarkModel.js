const mongoose = require("mongoose");

const BookMarkSchema = new mongoose.Schema(
  {
    surahID: {
      type: mongoose.Schema.ObjectId,
      ref: "Surah",
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

BookMarkSchema.pre(/^find/, function (next) {
  this.find({ deleted: { $ne: true } });
  next();
});

const Favorites = mongoose.model("Favorites", BookMarkSchema);

module.exports = Favorites;
