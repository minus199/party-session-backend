const session = require("express-session");
const FileStore = require("session-file-store")(session);
// session mgmt mw

const sessionMgmtMW = session({
  store: new FileStore({
    path: "./sessions"
  }),
  saveUninitialized: true,
  resave: false,
  cookie: { sameSite: true },
  secret: "secret_top_cat"
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

module.exports = { sessionMgmtMW, sessionCounterMW };
