const mqtt = require("mqtt");
const express = require("express");
const client = mqtt.connect("mqtt://127.0.0.1:8012", {
  username: "user",
  password: "123456",
});
client.on("connect", function () {
  console.log("服务器连接成功");
  console.log(client.options.clientId);
});

// http 服务
const app = express();
app.use(express.json());
app.use("/api/publish", (req, res) => {
  console.log("http 收到数据:", req.body);
  client.publish("active", JSON.stringify(req.body));
  res.json({
    code: 200,
    message: "success",
    data: null,
  });
});
app.listen("8014", () => {
  console.log("jd http listen on http://localhost:8014");
});
