var express = require("express");
var router = express.Router();
const authMW = require("../middlewares/auth-mw");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", authMW.fullAuth, (req, res) => {
  res.json({
    isLoggedIn: "userName" in req.session,
    sessID: req.sessionID,
    view: req.session.numOfView,
    expiresIn: req.session.cookie.maxAge / 1000
  });
});

// dump session data to client
router.get("/login-status", function (req, res, next) {
  res.json({
    isLoggedIn: req.session && "userName" in req.session,
    userName: `${req.session ? req.session.userName : "N/A"}`,
    sessID: req.sessionID,
    view: req.session ? req.session.numOfView : -1,
    expiresIn: req.session ? req.session.cookie.maxAge / 1000 : 0
  });
});

module.exports = router;
