/**
 * 云迹室内配送机器人
 */
const lolaList = [
  {
    real_data: ['11.38', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.37', '-34.24'],
    floor: 1,
  },
  {
    real_data: ['11.37', '-34.24'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.39', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.41', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.41', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.37', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.37', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.37', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.23'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.22'],
    floor: 1,
  },
  {
    real_data: ['10.76', '-29.34'],
    floor: 1,
  },
  {
    real_data: ['2.15', '-23.77'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-5.17', '-22.74'],
    floor: 1,
  },
  {
    real_data: ['-0.17', '-14.68'],
    floor: 12,
  },
  {
    real_data: ['-0.18', '-14.65'],
    floor: 12,
  },
  {
    real_data: ['2.76', '-7.49'],
    floor: 12,
  },
  {
    real_data: ['3.28', '-4.69'],
    floor: 12,
  },
  {
    real_data: ['1.61', '2.35'],
    floor: 12,
  },
  {
    real_data: ['1.38', '3.45'],
    floor: 12,
  },
  {
    real_data: ['2.84', '-3.81'],
    floor: 12,
  },
  {
    real_data: ['2.93', '-8.79'],
    floor: 12,
  },
  {
    real_data: ['2.9', '-11.73'],
    floor: 12,
  },
  {
    real_data: ['-2.22', '-20.0'], // 在电梯厅
    floor: 12,
  },
  {
    real_data: ['-2.22', '-20.0'],
    floor: 1,
  },
  {
    real_data: ['3.65', '-23.76'],
    floor: 1,
  },
  {
    real_data: ['11.32', '-33.54'], // 上桩
    floor: 1,
  },
  {
    real_data: ['11.42', '-34.16'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.25'],
    floor: 1,
  },
  {
    real_data: ['11.38', '-34.25'],
    floor: 1,
  },
  {
    real_data: ['11.4', '-34.23'],
    floor: 1,
  },
]

function init() {
  return lolaList.map((item) => {
    return {
      deviceId: 'DS_Robot_Deliverer_YJ_1',
      real_data: item.real_data,
      company: '云迹',
      floor: item.floor,
      speed: 8,
    }
  })
}

module.exports = init()
