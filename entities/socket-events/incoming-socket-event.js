const SocketEvent = require("./socket-event");
class IncomingSocketEvent extends SocketEvent{
    constructor(onlineUser, rawPayload) {
        const payload = JSON.parse(rawPayload);
        super(onlineUser, payload.type, payload.content);
    }
}

module.exports = IncomingSocketEvent;