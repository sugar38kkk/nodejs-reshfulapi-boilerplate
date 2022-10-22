const jwt = require("jsonwebtoken");
const { ErrBadRequest, ErrEntityNotFound } = require("../errors/custom-error");
const User = require("../models/user.model");
const {getValue} = require("../services/redis.service")

const requireAuth = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");
    const userAgent = req.headers['user-agent'];
    if (!bearerToken){
        throw new ErrBadRequest("Invalid Authentication.");
    }
    const TokenArray = bearerToken.split(" ");
    const token = TokenArray[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded){
        throw new ErrBadRequest("Invalid Authentication.");
    }
    
    const access_token_key = `${decoded.userId}_${userAgent}_access-token`
    const access_token_store = await getValue(access_token_key)
    const isExistedStrore = access_token_store === token
    if(!isExistedStrore){
      throw new ErrBadRequest("Invalid Authentication.");
    }
    const user = await User.findById(decoded.userId)
    if(!user) {
      throw new ErrEntityNotFound('User')
    }

    req.user = user.toJSON();
    next()
  } catch (error) {
    next(error)
  }
};

module.exports = requireAuth