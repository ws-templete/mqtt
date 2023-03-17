const mqtt = require("mqtt");
const client = mqtt.connect('mqtt://123.124.196.193:2102', {
  username: "user",
  password: '123456'
});
client.on("connect", function() {
  console.log("服务器连接成功");
  console.log(client.options.clientId);
  setInterval(function() {
    const value = '{"a":11,"b":222}';
    client.publish("active", value.toString(), { qos: 0, retain: true });
  }, 3000);
});
