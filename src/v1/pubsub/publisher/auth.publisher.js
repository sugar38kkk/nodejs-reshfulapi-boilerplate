const createPublisher = require("./createPublisher");
const { TOPIC_AUTH } = require("../topic");

const authPub = createPublisher(TOPIC_AUTH);

const publish = async (queueName, msg) => {
  await authPub.start();
  authPub.publish(queueName, msg);
  authPub.stop();
};

module.exports = {
  publish,
};
