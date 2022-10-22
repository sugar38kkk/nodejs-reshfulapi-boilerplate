const blogSub = require("./blog.subcriber");
const authSub = require("./auth.subcriber");
const queueName = require("../../constants/queue-name");
const { cacheToken, removeCacheToken } = require("../../services/auth.service");

const initSubcriber = () => {
  blogSub(queueName.QUEUE_LOG_MESSAGE, () => {
    console.log("Handle callback function.");
  });
  authSub(queueName.STORE_TOKEN, (message) => {
    cacheToken(message);
  });
  authSub(queueName.REMOVE_TOKEN, (message) => {
    removeCacheToken(message);
  });
};

module.exports = initSubcriber;
