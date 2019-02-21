const router = require("express").Router();
const OnlineUsers = require("../entities/online-users");
const {
	SocketEvent,
	IncomingSocketEvent,
	OutgoingSocketEvent,
	recentEvents
} = require("../entities/socket-events")

const onlineUsers = new OnlineUsers("party");
onlineUsers.on(OnlineUsers.Events.USER_ONLINE, e => {
	recentEvents.addToHistory("connections", e);
	onlineUsers.dispatchOverWs(e);
});

onlineUsers.on(OnlineUsers.Events.USER_OFFLINE, e => {
	recentEvents.addToHistory("connections", e);
	onlineUsers.dispatchOverWs(e);
});

//TODO: Save messages history on cloud
router.ws("/party", function (ws, req) {
	const currentClient = onlineUsers.connect(req, ws);

	const updateUserWithRecentMsgs = new OutgoingSocketEvent(currentClient, SocketEvent.Events.RECENT_MESSAGES, recentEvents.msgs.map(re => re.data))
	updateUserWithRecentMsgs.dispatch(currentClient);

	ws.on("message", rawPayload => {
		try {
			const incoming = new IncomingSocketEvent(currentClient, rawPayload);
			const se = OutgoingSocketEvent.fromIncoming(incoming);

			if (incoming.type === SocketEvent.Events.USER_LIKED_MSG) {
				const likedMessage = recentEvents.msgs.find(e => e.uuid === incoming.payload.comment_id);
				if (currentClient.username === likedMessage.username) {
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
				recentEvents.addToHistory("msgs", se);
				return;
			}
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