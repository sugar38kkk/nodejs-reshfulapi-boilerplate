const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const requireAuth = require("../middlewares/require-auth.middleware");
const verifyRefreshToken = require("../middlewares/verify-refresh-token.middleware");

const {
  signUpNewUser,
  signInUser,
  getProfile,
  refreshTokenUser,
  signoutUser,
} = require("../controllers/auth.controller");
const {
  validateRequest,
} = require("../middlewares/validate-request.middleware");

router.post(
  "/v1/auth/signup",
  [
    body("first_name")
      .isString()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("First name must be between 4 and 20 characters"),
    body("last_name")
      .isString()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Last name must be between 4 and 20 characters"),
    body("email").isEmail().withMessage("Email is invalid !!!"),
    body("username")
      .isString()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signUpNewUser
);

router.post(
  "/v1/auth/signin",
  [
    body("username").isString().trim().withMessage("Username is invalid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signInUser
);

router.get("/v1/auth/profile", requireAuth, getProfile);

router.get("/v1/auth/signout", requireAuth, signoutUser);

router.get("/v1/auth/refresh-token", verifyRefreshToken, refreshTokenUser);

module.exports = router;
