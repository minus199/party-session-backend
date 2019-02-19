const SocketEvent = require("./socket-event");

class OutgoingSocketEvent extends SocketEvent {
  constructor(client, type, payload) {
    super(client, type, payload);
  }

  static fromIncoming(ise) {
    return new OutgoingSocketEvent(ise.client, ise.type, ise.payload);
  }
}

module.exports = OutgoingSocketEvent;