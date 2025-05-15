const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const ApiError = require("../error/ApiError");

async function updateUserCredentials(user, data, next) {
  const { email, password } = data;

  if (email && email !== user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== user.id) {
      return next(ApiError.badRequest("Цей email вже зайнятий"));
    }
    user.email = email;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 5);
  }

  await user.save();
}

module.exports = { updateUserCredentials };