const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "phone number is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  photo: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  password: { type: String, required: [true, "password is required"] },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.corectpassword = async function (
  CondidatPassword,
  UserPassword
) {
  return await bcrypt.compare(CondidatPassword, UserPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
