const m4 = [
  {
    module: "4",
    deviceId: "04_02_01", // 卡扣1抬起
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_05_01", // 卡扣2抬起
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_05_01", // 卡扣降下
    commandId: "0",
  },
  {
    module: "4",
    deviceId: "04_03_03",
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_02_01",
    commandId: "0",
  },
  {
    module: "4",
    deviceId: "04_03_02",
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_06_03",
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_06_05",
    commandId: "1",
  },
  {
    module: "4",
    deviceId: "04_06_02",
    commandId: "1", // 通知机械手移动到初始位置
  },
  {
    module: "4",
    deviceId: "04_03_01", //
    commandId: "1", // 通知机械手 归位
  },
];
module.exports = m4;