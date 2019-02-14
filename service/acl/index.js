const users = {
  admin: "3858f62230ac3c915f300c664312c63f",
  nisan: "3858f62230ac3c915f300c664312c63f",
  foo: "3858f62230ac3c915f300c664312c63f"
};

const roles = Object.freeze({
  GUEST: "GUEST",
  ANON: "GUEST",
  REGULAR: "BASIC",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER-ADMIN",
  OWNER: "OWNER"
});

const permissions = [
  "user.edit.profile",
  "user.account.delete",
  "user.account.susspend"
];

const rolePermissions = {
  [roles.GUEST]: ["read"],
  [roles.REGULAR]: ["read", "write"],
  [roles.OWNER]: ["read", "write", "profile.all"],
  [roles.ADMIN]: ["read", "write", "delete"],
  [roles.SUPER_ADMIN]: ["read", "write", "delete", "shutdown", ...permissions]
};

const userRoles = {
  admin: roles.ADMIN,
  nisan: roles.SUPER_ADMIN,
  foo: roles.OWNER
};

module.exports = { users, roles, permissions, rolePermissions, userRoles };
