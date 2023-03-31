const aedes = require("aedes")();
//-----------------------MQTT broker creat-----------------------
const { createServer } = require("aedes-server-factory");
const port = 8002;
const wsPort = 8003;
const broker = require("net").createServer(aedes.handle);
broker.listen(port, function () {
  console.log("broker listening on port", port);
});
const httpServer = createServer(aedes, { ws: true });
httpServer.listen(wsPort, function () {
  console.log("websocket server listening on port ", wsPort);
});

//身份验证
aedes.authenticate = function (client, username, password, callback) {
  callback(null, username === "user" && password.toString() === "123456");
};

aedes.on("error", function (client) {
  console.log("error");
});

// 客户端连接
aedes.on("client", function (client) {
  console.log(
    "Client Connected: \x1b[33m" + (client ? client.id : client) + "\x1b[0m",
    "to broker",
    aedes.id
  );

  // test(client);
});
// 客户端断开
aedes.on("clientDisconnect", function (client) {
  console.log(
    "Client Disconnected: \x1b[31m" + (client ? client.id : client) + "\x1b[0m",
    "to broker",
    aedes.id
  );
});
// 客户端断开
aedes.on("publish", function (packet) {
  if (packet.cmd === "publish") {
    // switch (packet.topic) {
    //   case "active":
    //     console.log('message-active', packet.payload.toString());
    //     break;
    //   case "event":
    //     console.log("message-event", packet.payload.toString());
    //     break;
    // }
  }
});