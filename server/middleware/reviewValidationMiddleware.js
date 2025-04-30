const ReviewValidator = require("../validations/reviewValidation");

module.exports = function (req, res, next) {
  try {
    ReviewValidator.validateCreate(req.body);
    next();
  } catch (e) {
    console.error('❌ review validation error:', e.message);
    return res.status(400).json({ message: e.message });
  }
};
