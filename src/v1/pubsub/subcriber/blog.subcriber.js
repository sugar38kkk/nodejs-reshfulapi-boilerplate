const createSubcriber = require("./createSubcriber");
const { TOPIC_BLOG } = require("../topic");

const blogSub = (queueName, callback = ()=>{}) => {
  return createSubcriber(TOPIC_BLOG, queueName, callback)
};

module.exports = blogSub