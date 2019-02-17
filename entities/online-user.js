class ConnectedUser {
  constructor(user, ws) {
    this.user = user;
    this.ws = ws;
  }

  dispatch(wse) {
    return wse.dispatch(this);
  }

  disconnect() {
    this.ws.close();
  }

  get username() {
    return this.user.username;
  }

  get connectionStatus() {
    return this.ws.readyState;
  }

  get isOnline() {
    return this.ws.readyState === WebSocket.OPEN;
  }
}



module.exports = ConnectedUser;