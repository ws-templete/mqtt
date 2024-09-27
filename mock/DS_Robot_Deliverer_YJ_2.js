/**
 * 云迹室内配送机器人
 */
const lolaList = [
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'], // 等电梯
    floor: 1,
  },
  {
    real_data: ['-5.19', '-21.81'], // 进电梯中
    floor: 1,
  },
  {
    real_data: ['-0.15', '-14.65'],
    floor: 1,
  },
  {
    real_data: ['-0.15', '-14.65'], // 到12楼了
    floor: 12,
  },
  {
    real_data: ['2.82', '-5.86'],
    floor: 12,
  },
  {
    real_data: ['2.17', '-0.15'],
    floor: 12,
  },
  {
    real_data: ['1.36', '3.45'],
    floor: 12,
  },
  {
    real_data: ['2.57', '-1.72'], // 返程
    floor: 12,
  },
  {
    real_data: ['2.92', '-10.01'],
    floor: 12,
  },
  {
    real_data: ['2.95', '-14.51'], // 电梯外等待电梯
    floor: 12,
  },
  {
    real_data: ['2.24', '-14.59'], // 进电梯 (与实际电梯位置不同)
    floor: 12,
  },
  {
    real_data: ['-5.09', '-19.73'],
    floor: 1,
  },
  {
    real_data: ['-5.09', '-19.73'], // 出来到1楼了
    floor: 1,
  },
  {
    real_data: ['3.36', '-22.93'],
    floor: 1,
  },
  {
    real_data: ['5.99', '-19.92'],
    floor: 1,
  },
  {
    real_data: ['5.99', '-19.92'],
    floor: 1,
  },
  {
    real_data: ['5.91', '-19.92'],
    floor: 1,
  },
  {
    real_data: ['5.9', '-19.93'],
    floor: 1,
  },
]

function init() {
  return lolaList.map((item) => {
    return {
      deviceId: 'DS_Robot_Deliverer_YJ_2',
      real_data: item.real_data,
      company: '云迹',
      floor: item.floor,
      speed: 8,
    }
  })
}

module.exports = init()
