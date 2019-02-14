const ACL = require("../service/acl/index.js");
const MD5 = require("md5");
const basicAuth = require("express-basic-auth");
const UserService = require("../service/user-service");

const basicAuthInstance = basicAuth({ authorizer });
// Check if user name and password match -- used in basicAuth mw
function authorizer(username, password) {
  const currentUserPassword = ACL.users[username];
  if (!currentUserPassword) return false;

  if (currentUserPassword !== MD5(password)) {
    return false;
  }

  return true;
}

// extract basic auth info from request
function afterFullAuth(req, res, next) {
  req.currentUser = UserService.getByUsername(req.auth.user);
  console.log(`Found user ${req.currentUser.username}`);
  req.session.userName = req.currentUser.username;
  next();
}

function authBySession(req, res, next) {
  if (req.session.userName) {
    console.log(`Found user by session ${req.session.userName}`);
    req.currentUser = UserService.getByUsername(req.session.userName);
    return next();
  }

  if (req.ws) {
    req.ws.close();
  } else {
    res.status(401).json({ ERR: "You are not logged in." });
  }
}

module.exports = {
  fullAuth: [basicAuthInstance, afterFullAuth],
  authBySession
};
