// const lolaList = [
//   [-21732.8, 23299.4],
//   [-8326.74, 5686.81],
//   [-11744.4, -28457.5],
//   [-18539.7, -39658.7],
//   [-587.07, -27981.3],
//   [4495.88, -6384.88],
//   [4364.05, 13710.3],
//   [-5275.99, 24719.2],
// ]

// const lolaList = [
//   ['7223.21', '-8392.71'],
//   ['-840.355', '-7735.57'],
//   ['-9268.41', '-6952.78'],
//   ['-11604.2', '-6128.37'],
//   ['-15324.4', '-2810.65'],
//   ['-15348.1', '-225.021'],
//   ['-13683.7', '3726.08'],
//   ['-5044.73', '2979.68'],
//   ['968.459', '2474.27'],
//   ['3499.86', '3091.24'],
//   ['11075.7', '1461.59'],
//   ['18865.8', '199.886'],
//   ['22747.9', '-360.873'],
//   ['23843.1', '-571.853'],
//   ['23843.1', '-571.853'],
//   ['23843.1', '-571.853'],
//   ['-10112.2', '-6676.51'],
//   ['-13529.6', '-5451.72'],
//   ['-15411.6', '-1143.2'],
//   ['-15462.6', '1841.03'],
//   ['-10419', '3348.13'],
//   ['-1643.49', '2665.15'],
//   ['1424.97', '2495.14'],
//   ['9863.5', '1579.49'],
//   ['18349.9', '266.599'],
//   ['21344.2', '-151.405'],
//   ['26657.5', '-1811.27'],
//   ['26247.4', '-3758.29'],
//   ['21955.9', '-7629.38'],
//   ['19079.3', '-9105.88'],
//   ['17439.9', '-9152.16'],
//   ['8658.54', '-8417.62'],
//   ['186.484', '-7951.04'],
//   ['-8196.17', '-7264.03'],
//   ['-10908.8', '-6402.02'],
//   ['-15330.3', '-2815.17'],
//   ['-15365.7', '-385.444'],
//   ['-13278.3', '3648.41'],
//   ['-5187.85', '2966.4'],
//   ['941.623', '2477.59'],
//   ['7077.05', '1838.42'],
//   ['15014.9', '914.117'],
//   ['19554.2', '69.8323'],
//   ['25590.2', '-842.967'],
//   ['26495.8', '-2340.68'],
//   ['26353.8', '-3826.99'],
//   ['22522.6', '-7254'],
// ]

const lolaList = [
  ['20086.5', '-9990.18'],
  ['18266.5', '-9079.76'],
  ['16123.8', '-8834.45'],
  ['10857.1', '-8591.87'],
  ['4393.96', '-8233.35'],
  ['-1424.47', '-7788.49'],
  ['-6611.33', '-7479.9'],
  ['-10233.9', '-6652.06'],
  ['-12024.2', '-6031.83'],
  ['-14843.9', '-4505.02'],
  ['-15385.2', '-1006.74'],
  ['-15402.2', '752.638'],
  ['-14653.3', '3505.92'],
  ['-9870.56', '3322.96'],
  ['-4167.61', '2906.92'],
  ['628.858', '2588.12'],
  ['1575.86', '2448.01'],
  ['6306.6', '2104.82'],
  ['12420.8', '1305.55'],
  ['17731.9', '406.75'],
  ['19709.3', '162.864'],
  ['23864.5', '-635.78'],
  ['26473.3', '-1437.21'],
  ['26658.4', '-2957.71'],
  ['26288.9', '-3667.94'],
  ['25544.5', '-4578.97'],
  ['22460.6', '-7021.2'],
  ['21319.1', '-8007.9'],
]

function init() {
  return lolaList.map((item) => {
    return {
      deviceId: 'DS_Robot_Inspector_ZXZ_20',
      real_data: item,
      company: '智行者',
      floor: '',
      speed: 8,
    }
  })
}

module.exports = init()
