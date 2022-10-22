const blogSub = require("./blog.subcriber");
const authSub = require("./auth.subcriber");
const queueName = require("../../constants/queue-name");
const {cacheToken} = require("../../services/auth.service")

const initSubcriber = () => {
  blogSub(queueName.QUEUE_LOG_MESSAGE, () => {
    console.log("Handle callback function.");
  });
  authSub(queueName.STORE_TOKEN, (message) => {
    const data = JSON.parse(message.content.toString())
    cacheToken(data)
  });
};

module.exports = initSubcriber;
