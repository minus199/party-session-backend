const uuid = require("uuid/v4");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
// session mgmt mw

const sessionMgmtMW = session({
  genid: req => {
    if (req.session) {
      console.log("session found");
    }
    console.log(`Generating session ID for req.sessionID ${req.sessionID}`);
    return uuid(); // use UUIDs for session IDs
  },
  store: new FileStore({
    path: "./sessions"
  }),
  saveUninitialized: false,
  resave: true,
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
