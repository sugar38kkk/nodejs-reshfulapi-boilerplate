const { makeSubscriber } = require("amqp-simple-pub-sub");

const { AMPQ_URI } = process.env;

const createSubcriber = (exchange, queueName, callback = () => {}) => {
  const subscriber = makeSubscriber({
    exchange: exchange,
    url: AMPQ_URI,
    queueName: queueName,
    onError: (err) => {
      // optional
      console.error("A connection error happened", err); // or do something clever
    },
    onClose: () => {
      // optional
      console.log("The connection has closed."); // or do something clever
    },
  });

  const handler = (message) => {
    console.log("Message Received::", queueName);
    callback(message);
    subscriber.ack(message);
  };

  subscriber.start(handler);
};

module.exports = createSubcriber;
