const User = require("../models/user.model");
const { ErrEntityExisted, ErrBadRequest } = require("../errors/custom-error");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { Password } = require("../utils/password");
const { setValue, deleteValue } = require("./redis.service");
const logger = require("../utils/logger");

const authPub = require("../pubsub/publisher/auth.publisher");
const queueName = require("../constants/queue-name");

const that = (module.exports = {
  signUp: async ({ first_name, last_name, username, email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
          existingUser = await User.findOne({ username });
        }
        if (existingUser) {
          throw new ErrEntityExisted("User");
        }

        const newUser = User.build({
          first_name,
          last_name,
          username,
          email,
          password,
        });

        await newUser.save();

        resolve(newUser.id);
      } catch (error) {
        reject(error);
      }
    });
  },
  signIn: async ({ username, password, userAgent }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = await User.findOne({ email: username });
        if (!existingUser) {
          existingUser = await User.findOne({ username });
        }
        if (!existingUser) {
          throw new ErrBadRequest("Invalid credentials");
        }

        if (existingUser.status !== "ACTIVED") {
          throw new ErrBadRequest("User has been deleted or banned");
        }

        const passwordsMatch = await Password.compare(
          existingUser.password,
          password
        );
        if (!passwordsMatch) {
          throw new ErrBadRequest("Invalid credentials.");
        }

        const { access_token, expiry: access_token_expiry } =
          generateAccessToken({
            userId: existingUser.id,
          });
        const { refresh_token, expiry: refresh_token_expiry } =
          generateRefreshToken({
            userId: existingUser.id,
          });

        authPub.publish(
          queueName.STORE_TOKEN,
          JSON.stringify({
            access_token,
            refresh_token,
            access_token_expiry,
            refresh_token_expiry,
            userId: existingUser.id,
            userAgent,
          })
        );

        resolve({
          access_token,
          refresh_token,
          access_token_expiry,
          refresh_token_expiry,
          userId: existingUser.id,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  refreshToken: async ({ userId, userAgent }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { access_token, expiry: access_token_expiry } =
          generateAccessToken({
            userId: userId,
          });
        const { refresh_token, expiry: refresh_token_expiry } =
          generateRefreshToken({
            userId: userId,
          });

        authPub.publish(
          queueName.STORE_TOKEN,
          JSON.stringify({
            access_token,
            refresh_token,
            access_token_expiry,
            refresh_token_expiry,
            userId: userId,
            userAgent,
          })
        );

        resolve({
          access_token,
          refresh_token,
          access_token_expiry,
          refresh_token_expiry,
          userId: userId,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  signout: async ({ userId, userAgent }) => {
    return new Promise(async (resolve, reject) => {
      try {
        authPub.publish(
          queueName.REMOVE_TOKEN,
          JSON.stringify({
            userId: userId,
            userAgent,
          })
        );

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },
  cacheToken: async (message) => {
    try {
      const {
        access_token,
        refresh_token,
        access_token_expiry,
        refresh_token_expiry,
        userId,
        userAgent,
      } = JSON.parse(message.content.toString());

      const access_token_key = `${userId}_${userAgent}_access-token`;
      const refresh_token_key = `${userId}_${userAgent}_refresh-token`;
      const reqStoreAccessToken = setValue({
        key: access_token_key,
        value: JSON.stringify(access_token),
        expire: access_token_expiry / 1000,
      });
      const reqStoreRefreshToken = setValue({
        key: refresh_token_key,
        value: JSON.stringify(refresh_token),
        expire: refresh_token_expiry / 1000,
      });
      Promise.all([reqStoreAccessToken, reqStoreRefreshToken]);
    } catch (error) {
      logger.error(error.message);
    }
  },
  removeCacheToken: async (message) => {
    try {
      const { userId, userAgent } = JSON.parse(message.content.toString());

      const access_token_key = `${userId}_${userAgent}_access-token`;
      const refresh_token_key = `${userId}_${userAgent}_refresh-token`;
      const reqDeleteAccessToken = deleteValue(access_token_key);
      const reqDeleteRefreshToken = deleteValue(refresh_token_key);
      Promise.all([reqDeleteAccessToken, reqDeleteRefreshToken]);
    } catch (error) {
      logger.error(error.message);
    }
  },
});
