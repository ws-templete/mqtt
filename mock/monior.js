const list = [
  {
    twinId: '机柜-室外',
    metric: '出风温度',
    val: '34.123',
    unit: '℃',
    value: '34.123',
    time: 1723096455478,
  },
  // {
  //   twinId: '机柜-室外',
  //   metric: '实时功率',
  //   val: '200',
  //   unit: 'W',
  //   value: '200',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜-室外',
  //   metric: 'U方向',
  //   val: '北偏东12度',
  //   unit: '',
  //   // value: '北偏东12度',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜-室外',
  //   metric: 'M方向',
  //   val: '44',
  //   unit: '',
  //   // value: '北偏东12度',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜-室外',
  //   metric: 'CSS',
  //   val: '123',
  //   unit: '',
  //   // value: '北偏东12度',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜',
  //   metric: '出风温度',
  //   val: '34.123',
  //   unit: '℃',
  //   value: '34.123',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜',
  //   metric: '实时功率',
  //   val: '200',
  //   unit: 'W',
  //   value: '200',
  //   time: 1723096455478,
  // },
  // {
  //   twinId: '机柜',
  //   metric: 'U方向',
  //   val: '北偏东12度',
  //   unit: '',
  //   // value: '北偏东12度',
  //   time: 1723096455478,
  // },
]

function init() {
  // return lolaList.map((item, index) => {
  //   return {
  //     code: `00013c1e`,
  //     mac: `00013c1e`,
  //     anchor: '9000655d',
  //     map: 'test_1',
  //     mapId: '2',
  //     time: 1723096455478,
  //     id: '184',
  //     alias: 'T3c1e',
  //     msgType: 'coord',
  //     anchorList: ['9000665e'],
  //     imu: 1,
  //     createTime: '2024-08-08 13:54:15.478',
  //     x: item[0] * 100,
  //     y: item[1] * 100,
  //     z: 50,
  //     rate: 1,
  //   }
  // })
  return list
}

module.exports = init()
