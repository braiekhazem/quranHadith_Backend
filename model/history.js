const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    surahID: {
      type: mongoose.Schema.ObjectId,
      ref: "Surah",
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    type: {
      type: Number,
      required: [true, "you provide a type"],
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", HistorySchema);

module.exports = History;
