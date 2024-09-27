const mqtt = require('mqtt')

const DS_Robot_Inspector_ZXZ_20 = require('./mock/dsds/DS_Robot_Inspector_ZXZ_20')
const DS_Robot_Cleaner_ZXZ_50 = require('./mock/dsds/DS_Robot_Cleaner_ZXZ_50')
const DS_Robot_Cleaner_ZXZ_100 = require('./mock/dsds/DS_Robot_Cleaner_ZXZ_100')

const monior = require('./mock/monior')

const objs = {
  DS_Robot_Inspector_ZXZ_20: DS_Robot_Inspector_ZXZ_20,
  DS_Robot_Cleaner_ZXZ_50: DS_Robot_Cleaner_ZXZ_50,
  DS_Robot_Cleaner_ZXZ_100: DS_Robot_Cleaner_ZXZ_100,
}

// 当前测试的id
const currentId = [
  'DS_Robot_Inspector_ZXZ_20',
  'DS_Robot_Cleaner_ZXZ_50',
  'DS_Robot_Cleaner_ZXZ_100',
]

const client = mqtt.connect('mqtt://127.0.0.1:8002', {
  username: 'user',
  password: '123456',
})
client.on('connect', function () {
  console.log('服务器连接成功')
  console.log(client.options.clientId)
  test(client)
})

function test(client) {
  let i = 0
  let indexObject = {}

  currentId.forEach((key) => {
    indexObject[key] = 0
  })

  setInterval(() => {
    let list = []
    Object.entries(indexObject).forEach(([key, value]) => {
      const valueList = objs[key]

      if (indexObject[key] > valueList.length - 1) {
        indexObject[key] = 0
      }

      list.push(valueList[indexObject[key]])
      indexObject[key]++
    })

    client.publish('active', JSON.stringify(list), () => [])
    // const mapResult = monior.map((item) => {
    //   return {
    //     ...item,
    //     time: Date.now(),
    //     val: (Math.random() * 100).toFixed(4),
    //     // value: (Math.random() * 100).toFixed(4),
    //   }
    // })
    // client.publish('active', JSON.stringify(mapResult), () => [])
  }, 5000)
}
