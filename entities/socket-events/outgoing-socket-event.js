const SocketEvent = require("./socket-event");

class OutgoingSocketEvent extends SocketEvent {
  constructor(onlineUser, type, payload) {
    super(onlineUser, type, payload);
  }

  static fromIncoming(ise) {
    return new OutgoingSocketEvent(ise.user, ise.type, ise.payload);
  }
}

module.exports = OutgoingSocketEvent;