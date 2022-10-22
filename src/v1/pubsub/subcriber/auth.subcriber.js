const createSubcriber = require("./createSubcriber");
const { TOPIC_AUTH } = require("../topic");

const authSub = (queueName, callback = ()=>{}) => {
  return createSubcriber(TOPIC_AUTH, queueName, callback)
};

module.exports = authSub