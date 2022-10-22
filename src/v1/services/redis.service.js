const client = require("../databases/init.redis");
const logger = require("../utils/logger")

const that = (module.exports = {
  setValue: async ({ key, value, expire }) => {
    try {
      return await client.set(key, value, "EX", expire);
    } catch (error) {
      logger.error("Set data in redis error !");
    }
  },
  getValue: async (key) => {
    try {
      let val = await client.get(key);
      return JSON.parse(val);
    } catch (error) {}
  },
  deleteValue: async (key) => {
    try {
      await client.del(key);
      return true;
    } catch (error) {}
  },
});
