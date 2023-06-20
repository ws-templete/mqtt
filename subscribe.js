const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1:8012', {
  username: 'user',
  password: '123456'
})
client.on('connect', function () {
  console.log('服务器连接成功')
  console.log(client.options.clientId)
  client.subscribe('active', { qos: 1, }) // 订阅text消息
})
client.on('message', function (top, message) {
  console.log('当前topic：', top)
  console.log('内容：', message.toString())
})
// const mqtt = require('./node_modules/mqtt/dist/mqtt.js')
// const client = mqtt.connect("mqtt://123.124.196.193:2102"); //指定服务端地址和端口
// const client = mqtt.connect("ws://127.0.0.1:8002/mqtt"); //连接到mqtt服务端

// client.on("connect", function() {
//   console.log("服务器连接成功");
//   // connected = client.connected
//   client.subscribe("active", { qos: 1 }); //订阅主题为test的消息
// });
// client.on("message", function(top, message) {
//   console.log("当前topic：", top);
//   console.log("内容：", message.toString());
// });
