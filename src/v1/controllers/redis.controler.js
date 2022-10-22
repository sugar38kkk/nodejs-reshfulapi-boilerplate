"use strict";

const {
  setValue,
  getValue,
  deleteValue,
} = require("../services/redis.service");
const { EntityNotFound } = require("../errors/custom-error");
const blogPub = require("../pubsub/publisher/blog.publisher");
const queueName = require("../constants/queue-name");

const that = (module.exports = {
  setAsync: async (req, res, next) => {
    try {
      const { key, payload, expire } = req.body;
      if (1 < 2) {
        throw new EntityNotFound("Redis");
      }
      return res.json({
        data: await setValue({
          key,
          value: JSON.stringify(payload),
          expire,
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  getAsync: async (req, res, next) => {
    try {
      const { id: key } = req.params;

      blogPub.publish(queueName.QUEUE_LOG_MESSAGE, "Hello World");

      res.json({
        data: JSON.parse(await getValue(key)),
      });
    } catch (error) {
      next(error);
    }
  },
  delAsync: async (req, res, next) => {
    try {
      const { id: key } = req.params;

      return res.json({
        data: JSON.parse(await deleteValue(key)),
      });
    } catch (error) {
      next(error);
    }
  },
});
