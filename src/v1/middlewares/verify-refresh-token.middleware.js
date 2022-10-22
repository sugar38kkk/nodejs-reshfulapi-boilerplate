const jwt = require("jsonwebtoken");
const {
  ErrBadRequest,
  ErrEntityNotFound,
  ErrUnauthorized
} = require("../errors/custom-error");
const User = require("../models/user.model");
const { getValue } = require("../services/redis.service");

const verifyRefreshToken = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");
    const userAgent = req.headers["user-agent"];
    if (!bearerToken) {
      throw new ErrUnauthorized("Invalid Authentication.");
    }
    const TokenArray = bearerToken.split(" ");
    const token = TokenArray[1];
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      throw new ErrUnauthorized("Invalid Authentication.");
    }

    const refresh_token_key = `${decoded.userId}_${userAgent}_refresh-token`;
    const refresh_token_store = await getValue(refresh_token_key);
    const isExistedStrore = refresh_token_store === token;
    if (!isExistedStrore) {
      throw new ErrUnauthorized("Invalid Authentication.");
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ErrEntityNotFound("User");
    }
    if (user.status !== "ACTIVED") {
      throw new ErrBadRequest("User has been deleted or banned");
    }

    req.user = user.toJSON();
    req.userAgent = userAgent;
    next();
  } catch (error) {
    next(error)
  }
};

module.exports = verifyRefreshToken;
