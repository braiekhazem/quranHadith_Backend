const User = require("../model/userModel");

exports.createUser = async (user) => {
  return await User.create(user);
};

exports.getOne = async (filter) => {
  return await User.findOne(filter);
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};
