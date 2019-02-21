const session = require("express-session");
const FileStore = require("session-file-store")(session);
// session mgmt mw

const sessionMgmtMW = session({
  store: new FileStore({
    path: "./sessions"
  }),
  saveUninitialized: false,
  resave: false,
  secret: "secret_top_cat",
  cookie: {
    httpOnly: true, // this prevent us from being able to access the cookie with javascript. set false, and document.cookie will not be an empty string. see the session file
    maxAge: 24 * 60 * 60 * 1000
  }
});

// views count mw
const sessionCounterMW = (req, res, next) => {
  if (!req.session.numOfView) {
    req.session.numOfView = 0;
  }
  req.session.numOfView++;
  console.log(`Number of views ${req.session.numOfView}`);
  next();
};

module.exports = {
  sessionMgmtMW,
  sessionCounterMW
};