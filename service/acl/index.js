const users = {
  asaf: "72b2f5893cbf66a719ff3ba9bf032954", // no guessing
  foo: "3858f62230ac3c915f300c664312c63f",
  oof: "3858f62230ac3c915f300c664312c63f",
  adihason: '9f6f24eb2ac014601dc521ea73fc159d',
  azamos: '5d531dcdc468e151f172361a83ef9538',
  danielknut: 'ae01994e824d89d512a7fe4f20c59510',
  iritkatz: 'd80ba398f12d0894fb7bb2296bbf5ab1',
  kerencarmelwedel: '9bf7676be3238a39d8898182a2ec474e',
  nisandekel: 'b0e96a97e8a97c5f734db9c3a42e4aa8',
  Noyha: '9fdb1de9feff141dedfadf5f499fc8d3',
  Sicarius: 'f389ce653092e4c51ad5b550e67a938f',
  Yziv12345: 'b694a04b2c6f28903c73500851382bad',
  ayelet50: '17794a07c71a980c7923c0d72514517d',
  BenAmar7: '78cfd2a00e586003c3b5a4baae7cbe4c',
  iDoishere: '783e8aef042991abcea70c84d45cf772',
  Itainatan: 'db337eb859a6dc7a0e2a67699e2bc131',
  KirillSerchenko: 'a3ca9c27ac20a7db783a1fd063c8b86f',
  notyaaa: 'e05b435bd33cf576077669531c8ed98d',
  osbiyr: 'fd9405366c6533cea8b02834a4a20cc3',
  sapisav: '17da114227e39c244a72ed1cc0c9c286',
  TomVagish: '8330c9c3842fc4fd5ce1c39ffbc7376b'
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

module.exports = {
  users,
  roles,
  permissions,
  rolePermissions,
  userRoles
};