const SocketEvent = require("./socket-event");
class IncomingSocketEvent extends SocketEvent{
    constructor(currentClient, rawPayload) {
        const payload = JSON.parse(rawPayload);
        super(currentClient, payload.type, payload.content);
    }
}

module.exports = IncomingSocketEvent;