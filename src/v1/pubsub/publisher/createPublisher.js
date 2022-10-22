const { makePublisher } = require("amqp-simple-pub-sub");

const { AMPQ_URI } = process.env;

const createPublisher = (exchange) => {
  return makePublisher({
    exchange: exchange,
    url: AMPQ_URI,
    onError: (err) => {
      // optional
      console.error("A connection error happened", err); // or do something clever
    },
    onClose: () => {
      // optional
      console.log("The connection has closed."); // or do something clever
    },
  });
};

module.exports = createPublisher;
