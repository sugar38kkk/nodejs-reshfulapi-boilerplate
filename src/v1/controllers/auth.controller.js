"use strict";

const { signUp,signIn } = require("../services/auth.service");

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
      const userAgent = req.headers['user-agent'];
      return res.json({
        data: await signIn({
          username,
          password,
          userAgent
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  getProfile: async (req, res, next) => {
    try {
      return res.json({
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  },
});
