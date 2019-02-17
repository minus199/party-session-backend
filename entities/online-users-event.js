const UUID = require("uuid/v4");

class OnlineUsersEvent {
    constructor(onlineUsers, onlineUser, type, payload) {
        this.uuid = UUID();
        this.user = onlineUser;
        this.type = type;
        this.payload = payload;
        this.timestamp = Date.now();
        Object.defineProperty(this, "whosOnline", {
            get() {
                return onlineUsers.getConnected();
            }
        })
    }

    get data() {
        return Object.assign({
            uuid: this.uuid,
            user: this.user.username,
            type: this.type,
            whosOnline: this.whosOnline,
            timestamp: this.timestamp
        }, this.payload);
    }

    async dispatch(toClient) {
        toClient = toClient ? toClient : this.client;
        try {
            toClient.ws.send(JSON.stringify(this.data));
        } catch (e) {
            //Could be json error or socket error
            console.error("Unable to send", e);
        }
    }
}

module.exports = OnlineUsersEvent;