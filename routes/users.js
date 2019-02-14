var express = require("express");
var router = express.Router();

// TODO: Get all friends
router.get("/restricted", function(req, res, next) {
  res.json({ STATUS: "You're in" });
  next();
});

module.exports = router;
