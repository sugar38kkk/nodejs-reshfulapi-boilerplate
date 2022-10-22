"use strict";

const { signUp, signIn, refreshToken, signout } = require("../services/auth.service");

const that = (module.exports = {
  signUpNewUser: async (req, res, next) => {
    try {
      const { first_name, last_name, username, email, password } = req.body;
      return res.json({
        data: await signUp({
          first_name,
          last_name,
          username,
          email,
          password,
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  signInUser: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userAgent = req.headers["user-agent"];
      return res.json({
        data: await signIn({
          username,
          password,
          userAgent,
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  getProfile: async (req, res, next) => {
    try {
      return res.json({
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshTokenUser: async (req, res, next) => {
    try {
      return res.json({
        data: await refreshToken({
          userId: req.user.id,
          userAgent: req.userAgent,
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  signoutUser: async (req, res, next) => {
    try {
      return res.json({
        data: await signout({
          userId: req.user.id,
          userAgent: req.userAgent,
        }),
      });
    } catch (error) {
      next(error);
    }
  },
});
