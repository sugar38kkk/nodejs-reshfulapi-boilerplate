const express = require("express");
const router = express.Router();
const {
  setAsync,
  getAsync,
  delAsync,
} = require("../controllers/redis.controler");

router.get("/checkstatus", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "api ok",
  });
});

router.post("/v1/user", setAsync);

router.get("/v1/user/:id", getAsync);

router.delete("/v1/user/:id", delAsync);

module.exports = router;
