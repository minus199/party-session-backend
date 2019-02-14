const ACL = require("./acl");
const User = require("../entities/user");

const nullUser = Object.freeze(new User("anon"));

class UserService {
  getById(id) {}

  getByUsername(username) {
    if (ACL.users[username]) {
      const currentUserRole = ACL.userRoles[username];
      return new User(username, currentUserRole);
    }

    return nullUser;
  }
}

module.exports = new UserService();
