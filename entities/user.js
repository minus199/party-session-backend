const ACL = require("../service/acl");

class User {
  constructor(username, role = ACL.userRoles.REGULAR) {
    this.username = username;
    this._role = role;
    this._permissions = [ACL.permissions[2], ACL.permissions[0]];
  }

  get role() {
    return this._role;
  }

  get permissions() {
    return [...ACL.rolePermissions[this._role], ...this._permissions];
  }

  addPermission(...permission) {
    this._permissions.push(...permission);
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}

module.exports = User;
