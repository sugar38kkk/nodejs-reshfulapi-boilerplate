const createPublisher = require("./createPublisher");
const { TOPIC_BLOG } = require("../topic");

const blogPub = createPublisher(TOPIC_BLOG);

const publish = async (queueName, msg) => {
  await blogPub.start();
  blogPub.publish(queueName, msg);
  blogPub.stop();
};

module.exports = {
  publish,
};
