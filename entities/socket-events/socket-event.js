const UUID = require("uuid/v4");

class SocketEvent {
    constructor(onlineUser, type, payload) {
        this.user = onlineUser;
        this.uuid = UUID();
        this.type = type;
        this.payload = payload;
        this.timestamp = Date.now();
        this.dispatchedTo = [];
    }

    get data() {
        const dataObj = Object.assign({}, this);
        dataObj.user = this.user.username;
        dataObj.user = this.user.username;
        delete dataObj.dispatchedTo;
        return dataObj;
    }

    /**
     * 
     * @param {OnlineUser} toClient - optional. if not specified will use the user which created the event 
     */
    async dispatch(toClient) {
        console.log(`Dispatching ${this.uuid}:${this.type}`);
        toClient = toClient ? toClient : this.user;
        toClient.ws.send(JSON.stringify(this.data));
        this.dispatchedTo.push(toClient);
    }

    static fire(type, payload, toClient) {
        const e = new OutgoingSocketEvent(type, payload);
        e.dispatch(toClient);
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