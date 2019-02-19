const UUID = require("uuid/v4");

class SocketEvent {
    constructor(client, type, payload) {
        this.uuid = UUID();
        this.client = client;
        this.type = type;
        this.payload = payload;
        this.timestamp = Date.now();
        this.dispatchedTo = [];
    }

    get data() {
        const dataObj = Object.assign({}, this);
        dataObj.client = dataObj.client.user.username;
        delete dataObj.dispatchedTo;
        return dataObj;
    }

    async dispatch(toClient) {
        console.log(`Dispatching ${this.uuid}:${this.type}`);
        toClient = toClient ? toClient : this.client;
        toClient.ws.send(JSON.stringify(this.data));
        this.dispatchedTo.push(toClient);
    }

    static fire(type, payload, client, toClient) {
        const e = new OutgoingSocketEvent(client, type, payload);
        e.dispatch(toClient || client);
    }
}

SocketEvent.Events = Object.freeze({
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
    USER_NEW_MSG: "USER_NEW_MSG",
    RECENT_MESSAGES: "RECENT_MESSAGES",
    USER_TYPING: "USER_TYPING",
    USER_LIKED_MSG: "USER_LIKED_MSG"
});
 
module.exports = SocketEvent;