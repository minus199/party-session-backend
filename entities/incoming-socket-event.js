const SocketEvent = require("./socket-event");
class IncomingSocketEvent extends SocketEvent{
    constructor(rawPayload) {
        const payload = JSON.parse(rawPayload);
        super(null, payload.type, payload.content);
    }
}

IncomingSocketEvent.EVENTS = Object.freeze({
    USER_NEW_MSG: "USER_NEW_MSG"
})

module.exports = IncomingSocketEvent;