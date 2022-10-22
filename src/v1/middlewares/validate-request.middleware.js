const { validationResult } = require("express-validator");
const { ErrInvalidRequest } = require("../errors/custom-error");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ErrInvalidRequest(errors.array());
  }
  next();
};

module.exports = {
    validateRequest
}