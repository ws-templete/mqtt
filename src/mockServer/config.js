const _config = {
  // 编号规则
  rules: {
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
    到货计划: {
      prefix: "dhjh",
      length: 6,
      step: 1,
      start: 100000,
      interval: 5000,
    },
    入园: {
      prefix: "ry",
      length: 6,
      step: 1,
      start: 100000,
      interval: 10000,
    },
    卸货指引: {
      prefix: "xh",
      length: 6,
      step: 1,
      start: 100000,
      interval: 10000,
    },
    上架指引: {
      prefix: "sj",
      length: 6,
      step: 1,
      start: 100000,
      interval: 10000,
    },
    下架指引: {
      prefix: "xj",
      length: 6,
      step: 1,
      start: 100000,
      interval: 10000,
    },
    出库指引: {
      prefix: "ck",
      length: 6,
      step: 1,
      start: 10000,
      interval: 10000,
    },
  },
};

module.exports = {
  clone() {
    return JSON.parse(JSON.stringify(_config));
  },
};
