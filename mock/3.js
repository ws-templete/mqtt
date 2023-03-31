const m3 = [
  {
    module: "3",
    deviceId: "03_02_01", // 卡扣1抬起
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_09_01", // 卡扣2抬起
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_09_01", // 卡扣2抬起
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_04_03", // 机械手开始抓盒子称重
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_07_04", // 机械手开始打印
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_02_01", // 卡扣1复位
    commandId: "0",
  },
  {
    module: "3",
    deviceId: "03_04_02", // 机械手复位
    commandId: "1",
  },
  {
    module: "3",
    deviceId: "03_09_01", // 卡扣2复位
    commandId: "0",
  },
  {
    module: "3",
    deviceId: "03_07_02", // 机械手复位
    commandId: "1",
  },
];
module.exports = m3;