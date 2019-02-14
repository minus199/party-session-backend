class SocketEvent {
  constructor(client, type, payload) {
    this.client = client;
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }

  get data() {
    return {
      type: this.type,
      payload: this.payload,
      timestamp: this.timestamp,
      client: this.client.user.username
    };
  }

  async dispatch(toClient) {
    toClient = toClient ? toClient : this.client;
    toClient.ws.send(JSON.stringify(this.data));
  }

  static fire(type, payload, client, toClient) {
    const e = new SocketEvent(client, type, payload);
    e.dispatch(toClient || client);
  }
}

SocketEvent.Events = Object.freeze({
  USER_ONLINE: "USER_ONLINE",
  INCOMING_MSG: "INCOMING_MSG"
});

module.exports = SocketEvent;