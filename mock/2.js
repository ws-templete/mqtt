const m2 = [
  {
    module: "2",
    deviceId: "02_08", // 卡扣抬起
    commandId: "1",
  },
  {
    module: "2",
    deviceId: "02_09_03", // 机械手开始抓糖
    commandId: "1",
  },
  {
    module: "2",
    deviceId: "02_09_07", // 移动到黑色托盘位置2
    commandId: "1",
  },
  {
    module: "2",
    deviceId: "02_08", // 卡扣复位
    commandId: "0",
  },
  {
    module: "2",
    deviceId: "02_09_02", // 机械手复位
    commandId: "1",
  },
];

module.exports = m2;
