const jwt = require("jsonwebtoken");

const { ACTIVE_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } =
  process.env;

const accessTokenExpire = {
  expiresIn : "15m",
  expiry: 15 * 60 * 1000
}
const activeTokenExpire = {
  expiresIn : "5m",
  expiry: 5 * 60 * 1000
}
const refreshTokenExpire = {
  expiresIn : "30d",
  expiry: 30 * 24 * 60 * 60 * 1000
}

const generateActiveToken = (payload) => {
  return {
    active_token : jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, { expiresIn: activeTokenExpire.expiresIn }),
    expiry: activeTokenExpire.expiry
  }
};

const generateAccessToken = (payload) => {
  return {
    access_token : jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn: accessTokenExpire.expiresIn }),
    expiry: accessTokenExpire.expiry
  }
};

const generateRefreshToken = (payload) => {

  return {
    refresh_token: jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, {
      expiresIn: refreshTokenExpire.expiresIn,
    }),
    expiry: refreshTokenExpire.expiry
  }
};




module.exports = {
    generateAccessToken,
    generateActiveToken,
    generateRefreshToken
}