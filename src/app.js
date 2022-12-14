const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const loggerV1 = require("./v1/utils/logger");
const initSubcriber = require("./v1/pubsub/subcriber/init.subcriber");

//init dbs
require("./v1/databases/init.mongodb");
// require('./v1/databases/init.redis')

initSubcriber();

//user middleware
app.use(helmet());
app.use(morgan("combined"));
// compress responses
app.use(compression());

// add body-parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//router
app.use(require("./v1/routes/index.router"));
app.use(require("./v1/routes/auth.router"));

// main
app.use("/", (req, res, next) => {
  res.send("WELCOME TO API BLOG DEV");
});

// Error Handling Middleware called

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  error.key = "ErrNotFound";
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  const err = errorHandler(error);
  res.status(error.status || 500).send({
    error: err,
  });
});

const errorHandler = (error) => {
  let err = {
    status: error.status || 500,
    message: error.message || "Internal Server Error",
    key: error.key || "ErrInternal",
  };
  if (error.name === "TokenExpiredError" && error.message === "jwt expired") {
    err.key = "ErrTokenExpired";
    err.status = 401;
    err.message = "Token expired";
  }
  if (error.name === "JsonWebTokenError") {
    err.key = "ErrInvalidToken";
    err.status = 401;
    err.message = "Invalid token";
  }
  if (error.errors) {
    err.errors = error.errors;
  }
  loggerV1.error(err.message);
  return err;
};

module.exports = app;
