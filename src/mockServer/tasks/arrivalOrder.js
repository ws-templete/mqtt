/**
 * 模拟到货计划
 */
const mockjs = require("mockjs");

class ArrivalOrder {
  constructor() {
    this.num = 0;
    this.timer = null;
  }
  onStart(ctx) {
    const { config, client } = ctx;

    this.timer = setInterval(() => {
      if (this.num >= 1) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      const data = mockjs.mock({
        "data|1-2": [
          {
            商品编号: () => ctx.helper.getId("goodsNo"),
            商品类型: "空调",
            商品名称: "1.25P空调",
            商品数量: 1,
            生产厂家: "格力",
            生产日期: 44927,
            合格率: 96,
            运输货车车牌号: () => ctx.helper.getId("carNo"),
            _id: "@increment(1)",
          },
        ],
      });

      this.num += data.data.length;
      ctx.data.addArrivalOrderList(...data.data);

      console.log("推送数据 到货计划");
      ctx.publish("active", JSON.stringify({
        tasktype: "到货计划",
        taskNo: ctx.helper.getId("到货计划"),
        taskdail: data.data
      }));
    }, 4000);
  }
  onStop() {
    clearInterval(this.timer);
    this.timer = null;
    this.num = 0;
  }
}

module.exports = ArrivalOrder;
