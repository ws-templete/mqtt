/**
 * 模拟到货计划
 */
const mockjs = require("mockjs");

class ArrivalTask {
  constructor() {
    this.num = 0;
    this.timer = null;
  }
  onStart(ctx) {
    const publish = () => {
      if (this.num >= 5) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      const data = mockjs.mock({
        "data|4": [
          {
            商品编号: () => ctx.helper.getId("goodsNo"),
            商品类型: "空调",
            商品名称: "1.25P空调",
            商品数量: 10,
            生产厂家: "格力",
            生产日期: 44927,
            合格率: 96,
            运输货车车牌号: () => ctx.helper.getId("carNo"),
            预计到达: "", //mockjs.Random.time('HH:mm:ss'),
            _id: "@increment(1)",
          },
        ],
      });

      this.num += data.data.length;
      // 添加到数据库
      data.data.forEach((item) => {
        ctx.data.addArrivalList(item);
      });

      console.log("推送数据 到货计划", data.data.length);
      ctx.publish(
        "active",
        JSON.stringify({
          tasktype: "到货计划",
          taskNo: ctx.helper.getId("到货计划"),
          taskdail: data.data,
        })
      );
    };

    publish();
    this.timer = setInterval(publish, 4000);
  }
  onStop() {
    clearInterval(this.timer);
    this.timer = null;
    this.num = 0;
  }
}

module.exports = ArrivalTask;
