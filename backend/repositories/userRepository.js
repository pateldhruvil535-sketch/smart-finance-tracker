const User = require("../models/User");

// Create User
exports.createUser = async (data) => {
  return await User.create(data);
};

// Find by email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

// Find by ID
exports.findUserById = async (id) => {
  return await User.findById(id).select("-password");
};