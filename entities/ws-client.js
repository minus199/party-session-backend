class WsClient {
  constructor(user, ws) {
    this.user = user;
    this.ws = ws;
  }

  get username() {
    return this.user.username;
  }
}



module.exports = WsClient;