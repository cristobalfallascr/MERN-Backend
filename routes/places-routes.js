const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET request on root");
  res.json({ message: "successful Get request" });
});

module.exports = router;
