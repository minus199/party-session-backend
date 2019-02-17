const SocketEvent = require("./socket-event");

class OutgoingSocketEvent extends SocketEvent {
  constructor(client, type, payload) {
    super(client, type, payload);
  }
}

OutgoingSocketEvent.Events = Object.freeze({
  USER_ONLINE: "USER_ONLINE",
  USER_OFFLINE: "USER_OFFLINE",
  INCOMING_MSG: "INCOMING_MSG",
  RECENT_MESSAGE: "RECENT_MESSAGE" 
});

module.exports = OutgoingSocketEvent;