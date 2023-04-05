const mongoose = require("mongoose");

const ayahSchema = new mongoose.Schema({
  number: Number,
  text: String,
  numberInSurah: Number,
  juz: Number,
  manzil: Number,
  page: Number,
  ruku: Number,
  hizbQuarter: Number,
  sajda: Boolean,
  surahID: {
    type: mongoose.Schema.ObjectId,
    ref: "Surah",
  },
});

const Ayahs = mongoose.model("Ayahs", ayahSchema);

module.exports = Ayahs;
