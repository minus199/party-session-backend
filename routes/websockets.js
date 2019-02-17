const router = require("express").Router();
const OnlineUsers = require("../entities/online-users");
const OutgoingSocketEvent = require("../entities/outgoing-socket-event");
const IncomingSocketEvent = require("../entities/incoming-socket-event");

const recentEvents = [];
const addEventToHistory = e => {
	if (e.type !== "USER_NEW_MSG") return;
	recentEvents.push(e);
	if (recentEvents.length > 100) {
		recentEvents.shift();
		// keeps the history at the size of 100 max items -- otherwise, it'll cause memory leaks overtime
	}
}

const onlineUsers = new OnlineUsers("party");
onlineUsers.on(OnlineUsers.Events.USER_ONLINE, e => {
	onlineUsers.dispatchOverWs(e); // TODO: Noly send event to the relevant users
});

onlineUsers.on(OnlineUsers.Events.USER_OFFLINE, e => {
	onlineUsers.dispatchOverWs(e);
});

//TODO: Save messages history on cloud
router.ws("/party", function (ws, req) {
	const currentClient = onlineUsers.connect(req, ws);
	new OutgoingSocketEvent(currentClient, OutgoingSocketEvent.Events.RECENT_MESSAGE, recentEvents.map(e => e.data)).dispatch()

	ws.on("message", rawPayload => {
		try {
			const incoming = new IncomingSocketEvent(rawPayload);
			const se = new OutgoingSocketEvent(currentClient, incoming.type, incoming.payload);
			onlineUsers.dispatchOverWs(se);
			addEventToHistory(se);
			//TODO: Only send the event to the relevant user(for example, the user that is typing should not be notified about it)
		} catch (e) {
			console.error("Error over socket", e);
		}
	});

	ws.on("close", () => {
		try {
			onlineUsers.disconnect(currentClient.username);
		} catch (e) {
			console.error(e);
		}
	});
});

module.exports = router;