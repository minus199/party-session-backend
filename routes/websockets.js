const router = require("express").Router();
const OnlineUsers = require("../entities/online-users");
const {
	SocketEvent,
	IncomingSocketEvent,
	OutgoingSocketEvent
} = require("../entities/socket-events")
const recentEvents = [];

const addEventToHistory = e => {
	if (e.type !== SocketEvent.Events.USER_NEW_MSG) return;
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
	new OutgoingSocketEvent(currentClient, SocketEvent.Events.RECENT_MESSAGES, recentEvents.map(re => re.data)).dispatch()

	ws.on("message", rawPayload => {
		try {
			const incoming = new IncomingSocketEvent(currentClient, rawPayload);
			const se = OutgoingSocketEvent.fromIncoming(incoming);
			if (incoming.type === SocketEvent.Events.USER_LIKED_MSG) {
				const likedMessage = recentEvents.find(e => e.uuid === incoming.payload.comment_id);
				if (currentClient.username === likedMessage.client.username) {
					console.info(`Blocked user ${currentClient.username} from liking its own comment`);
					return;
				}
			
				likedMessage.likedCount += 1;
				se.likedCount = likedMessage.likedCount;
				onlineUsers.dispatchOverWs(se, currentClient.username);
				return;
			}

			
			if (se.type === SocketEvent.Events.USER_TYPING) {
				onlineUsers.dispatchOverWs(se, currentClient.username);
				return;
			}

			if (se.type === SocketEvent.Events.USER_NEW_MSG) {
				se.likedCount = 0;
				onlineUsers.dispatchOverWs(se);
				addEventToHistory(se);
				return;
			}

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