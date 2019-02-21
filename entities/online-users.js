const connectedUsers = {};
const Emitter = require("events");
const OnlineUser = require("./online-user");
const OnlineUsersEvent = require("./online-users-event");

class OnlineUsers extends Emitter {
    constructor(topic) {
        super();
        this.topic = topic;
        connectedUsers[topic] = {};
        // This will allow us to create a new event instance with this collection bound to it
        this.BoundUserEvent = OnlineUsersEvent.bind(null, this);
    }

    getConnected() {
        return Object.entries(connectedUsers[this.topic]).map(([cn, c]) => c.user.username)
    };

    connect(req, ws) {
        //TODO: What if is the user already connected?(in same or another tab/window/device)
        const currentClient = new OnlineUser(req.currentUser, ws);
        this.disconnect(currentClient); // disconnects any existing ws(we can also keep it alive and manage multiple sockets for the same user)

        // connect the user with the new connection
        connectedUsers[this.topic][currentClient.username] = currentClient;
        this.emit(OnlineUsers.Events.USER_ONLINE, new this.BoundUserEvent(currentClient, OnlineUsers.Events.USER_ONLINE));

        return currentClient;
    }

    disconnect(onlineUser) {
        onlineUser = typeof onlineUser === "string" ? onlineUser : onlineUser.username;
        const currentClient = connectedUsers[this.topic][onlineUser];
        if (!currentClient) return;

        // If the client already have an existing connection. Close it.
        // We could handle a list of ws for each client, instead of just one(each tab will create a new ws).
        currentClient.disconnect();
        delete connectedUsers[this.topic][onlineUser];
        this.emit(OnlineUsers.Events.USER_OFFLINE, new this.BoundUserEvent(currentClient, OnlineUsers.Events.USER_OFFLINE));
    }

    dispatchOverWs(socketEvent, ...exclude) {
        Object.entries(connectedUsers[this.topic]).forEach(([cname, c]) => {
            if (exclude.includes(cname)) return;
            socketEvent.dispatch(c)
        });
    }
}

OnlineUsers.Events = Object.freeze({
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
})
module.exports = OnlineUsers;