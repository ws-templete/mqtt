
/**
 * 推送数据看板
 */
class DataPanel {
  constructor() {
    this.timer = null;
  }
  onStart(ctx) {
    this.timer = setInterval(() => {
      const postData = {
        type: "orderData", // 数据类型
        sceneId: "2C339434-BEB7-439A-8ADF-CD4B41B7D171", // 场景 ID
        data: [
          {
            title: "到货计划",
            list: ctx.data.arrivalList.map((t) => {
              return {
                车次号: t.运输货车车牌号,
                车牌号: t.运输货车车牌号,
                品类: t.商品类型,
                品类编号: t.商品编号,
                商品名称: t.商品名称,
                // 包装数量: t.商品数量,
                数量: t.商品数量,
                合格率: t.合格率,
                预计到达: t.预计到达,
                当前状态: "到达",
              };
            }),
          },
          {
            title: "卸货引导",
            list: ctx.data.unloadList.map((t) => {
              return {
                任务单号: t.taskID,
                车次号: t.taskdail.trainNo,
                车牌号: "京A.909090",
                到达时间: "18:05",
                已等待时间: 20,
                计划停靠月台: "1#月台",
                当前位置: "暂停区",
                操作: ["查看"],
              };
            }),
          },
          {
            title: "商品验货",
            list: [
              {
                任务单号: "yh000988",
                品类: "家电",
                品类编号: "SP0010101",
                商品名称: "冰箱",
                数量: 10,
                验货结果: "合格",
                操作: ["查看"],
              },
            ],
          },
          {
            title: "组板流程",
            list: [
              {
                任务单号: "zb000988",
                码盘ID: "MP_01_01_009",
                品类编号: "SP0010101",
                商品名称: "冰箱",
                购买数量: 2,
                购买时间: Date.now(),
                是否尾货: "否",
                状态: "完成",
                操作: ["查看"],
              },
            ],
          },
          {
            title: "上架流程",
            list: ctx.data.onList.map((t) => {
              return {
                任务单号: t.taskID,
                码盘ID: "MP_01_01_009",
                品类编号: "SP0010101",
                商品名称: "冰箱",
                货架编号: "1#货架",
                货位编号: "AJ090",
                状态: "完成",
                操作: ["查看"],
              };
            }),
          },
          {
            title: "订单看板",
            list: [
              {
                订单编号: "DD0990",
                商品类型: "服饰",
                商品编号: "SP0010101",
                商品名称: "休闲裤",
                购买数量: 2,
                购买时间: "18:05",
                库存剩余: 123,
                收货地址: "恒通软件园",
              },
            ],
          },
          {
            title: "商品下架",
            list: ctx.data.offList.map((t) => {
              return {
                任务单号: t.taskID,
                商品类型: "家电",
                商品编号: "SP0010101",
                商品名称: "冰箱",
                货架编号: "1#货架",
                货位编号: "AJ090",
                下架数量: 1,
                购买时间: "18:05:00",
                库存剩余: 123,
                收货地址: "恒通软件园",
                操作: ["查看"],
              };
            }),
          },
          {
            title: "打包分流",
            list: [
              {
                任务单号: "db000988",
                商品类型: "家电",
                商品编号: "SP0010101",
                商品名称: "冰箱",
                分流道口: "1#道口",
                状态: "完成",
                操作: ["查看"],
              },
            ],
          },
          {
            title: "装车发货",
            list: [
              {
                任务单号: "zc000988",
                商品类型: "家电",
                商品编号: "SP0010101",
                商品名称: "冰箱",
                装车月台: "1#道口",
                目的地: "朝阳配送站",
                状态: "完成",
                操作: ["查看"],
              },
            ],
          },
        ],
      };

      // console.log("发布数据看板", postData);
      ctx.publish("active", postData);
    }, 3000);
  }
  onStop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

module.exports = DataPanel;
