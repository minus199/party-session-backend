const express = require("express");

const commonMW = require("./middlewares/default-mw");
const {
    sessionCounterMW,
    sessionMgmtMW
} = require("./middlewares/sessions");
const {
    authBySession
} = require("./middlewares/auth-mw");
const path = require("path");

const app = express();
app.use(commonMW);
app.use(express.static(path.join(__dirname, process.argv[2] || "../party-session-app")));
app.use([sessionMgmtMW, sessionCounterMW]);

const wsRef = require("express-ws")(app);
app.use("/ws", authBySession, require("./routes/websockets"));

const homepageRouter = require("./routes/homepage");
app.use("/", homepageRouter);

const usersRouter = require("./routes/users");
app.use("/users", authBySession, usersRouter);

const meRouter = require("./routes/me");
app.use("/me", authBySession, meRouter);

app.listen(3000, () => console.log(`PartyServer is connected at port 3000`));

module.exports = app;