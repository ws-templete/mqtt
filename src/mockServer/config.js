const _config = {
  // 编号规则
  rules: {
    bagNo: {
      prefix: "BAG",
      length: 7,
      step: 1,
      start: 10000,
    },
    goodsNo: {
      prefix: "SP",
      length: 7,
      step: 1,
      start: 10000,
    },
    carNo: {
      prefix: "京.N",
      length: 6,
      step: 1,
      start: 90909,
    },
    入库单: {
      prefix: "RK",
      length: 6,
      step: 1,
      start: 100000,
      interval: 2000,
    },
    入园: {
      prefix: "RY",
      length: 6,
      step: 1,
      start: 100000,
      interval: 2000,
    },
    卸货指引: {
      prefix: "XH",
      length: 6,
      step: 1,
      start: 100000,
      interval: 2000,
    },
    组板指引: {
      prefix: "ZB",
      length: 6,
      step: 1,
      start: 100000,
      interval: 2000,
    },
    上架指引: {
      prefix: "SJ",
      length: 6,
      step: 1,
      start: 100000,
      interval: 2000,
    },
    出库指引: {
      prefix: "CK",
      length: 6,
      step: 1,
      start: 10000,
      interval: 2000,
    },
  },
};

module.exports = {
  clone() {
    return JSON.parse(JSON.stringify(_config));
  },
};
