const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")

const loggerV1 = require("./v1/utils/logger");
const initSubcriber = require("./v1/pubsub/subcriber/init.subcriber");


const swaggerOptions = {
  explorer: true,
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Blog Dev API",
      description: "Blog Dev API Information",
      contact: {
        name: "STech"
      },
      servers: ["http://localhost:3051"]
    }
  },
  // ['.routes/*.js']
  apis: ["src/app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /:
 *    post:
 *      description: Hello
 *    responses:
 *      '200':
 *        description: Successfully created user
 */


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
app.use("/",(req, res, next) => {
  res.send("WELCOME TO API BLOG DEV")
});

// Error Handling Middleware called

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  error.key = 'ErrNotFound'
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  const err = {
    status: error.status || 500,
    message: error.message || "Internal Server Error",
    key: error.key || "ErrInternal",
  };
  if(error.errors){
    err.errors = error.errors
  }
  loggerV1.error(err.message);
  res.status(error.status || 500).send({
    error: err,
  });
});



module.exports = app;
