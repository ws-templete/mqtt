const mqtt = require('mqtt')
const m1 = require('./mock/1')
const m2 = require('./mock/2')
const m3 = require('./mock/3')
const m4 = require('./mock/4')

const client = mqtt.connect('mqtt://127.0.0.1:8002', {
  username: 'user',
  password: '123456'
})
client.on('connect', function () {
  console.log('服务器连接成功')
  console.log(client.options.clientId)
  test(client)
})

function test(client) {
  setInterval(() => {
    ;[...m1, ...m2, ...m3, ...m4].forEach((m) => {
      client.publish('active', JSON.stringify(m), () => {})
      // client.publish('active', JSON.stringify(m), () => {})
    })
  }, 1000)
}
