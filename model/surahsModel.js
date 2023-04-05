const mongoose = require("mongoose");

const surahSchema = new mongoose.Schema({
  number: Number,
  name: String,
  englishName: String,
  englishNameTranslation: String,
  revelationType: String,
  ayahsNumber: Number,
});

const Surah = mongoose.model("Surah", surahSchema);

module.exports = Surah;
