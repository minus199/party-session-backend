const SocketEvent = require("./socket-event");

module.exports = {
    msgs: [],
    connections: [],
    addToHistory(category, e) {
        if (e.type !== SocketEvent.Events.USER_NEW_MSG) return;
        const eventsStore = this[category];
        eventsStore.push(e);
        if (eventsStore.length > 100) { // TODO: Remove this after using database to store everything(we only limit to 100 items due to ram limitiations)
            eventsStore.shift();
            // keeps the history at the size of 100 max items -- otherwise, it'll cause memory leaks overtime
        }
    }
};