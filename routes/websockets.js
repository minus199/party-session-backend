const { Router } = require("express");
const router = Router();

const WsClient = require("../entities/ws-client");
const SocketEvent = require("../entities/socket-event");

let clients = {};

const getConnected = () => Object.entries(clients).map(([cn, c]) => c.user.username);

router.ws("/party", function (ws, req) {
  //TODO: What if is the user already connected?(in same or another tab/window/device)

  const currentClient = new WsClient(req.currentUser, ws);

  clients[currentClient.username] = currentClient;
  const se = new SocketEvent(currentClient, SocketEvent.Events.USER_ONLINE, { connected: getConnected() });
  Object.entries(clients).forEach(([cname, c]) => {
    se.dispatch(c);
  });

  ws.on("message", function (msg) {
    const se = new SocketEvent(currentClient, SocketEvent.Events.INCOMING_MSG, { msg });
    Object.entries(clients).forEach(([cname, c]) => {
      se.dispatch(c);
    });
  });

  ws.on("close", () => { delete clients[currentClient.username] })
});

module.exports = router;
