const dayjs = require("dayjs");
/**
 * 推送数据看板
 */
class DataPanel {
  constructor() {
    this.timer = null;
  }

  onCreated(ctx) {
    ctx.publish(
      "active",
      JSON.stringify({
        type: "orderData", // 数据类型
        sceneId: "2C339434-BEB7-439A-8ADF-CD4B41B7D171", // 场景 ID
        data: [
          {
            title: "到货计划",
            list: [],
          },
          {
            title: "卸货指引",
            list: [],
          },
          // {
          //   title: "组板流程",
          //   list: [],
          // },
          {
            title: "上架流程",
            list: [],
          },
          {
            title: "订单看板",
            list: [],
          },
          {
            title: "商品下架",
            list: [],
          },
        ],
      })
    );
  }

  formatTime(time) {
    return dayjs(time).format("HH:mm:ss");
  }

  onStart(ctx) {
    const reverse = (arr) => {
      const cloneArr = JSON.parse(JSON.stringify(arr));
      return cloneArr.reverse();
    };

    this.timer = setInterval(() => {
      const postData = {
        type: "orderData", // 数据类型
        sceneId: "2C339434-BEB7-439A-8ADF-CD4B41B7D171", // 场景 ID
        data: [
          {
            title: "到货计划",
            list: reverse(ctx.data.arrivalList).map((t) => {
              return {
                车次号: t.RKNO,
                车牌号: t.carNO,
                包裹数量: t.GOODSDTO.length,
                当前状态: "到达",
                id: t._id,
              };
            }),
          },
          {
            title: "卸货指引",
            list: reverse(ctx.data.unloadList).map((t) => {
              return {
                卸货单号: t.taskID,
                卸货单状态: t.progress?.done ? "已完成" : "进行中",
                包裹数量:
                  t.taskdetail.$relativeData?.arrivalTask?.taskdetail?.length,
                实际卸货数量: t.progress?.index || 0,
                创建时间: this.formatTime(t.createTime),
                完成时间: this.formatTime(t.finishTime),
                操作人员: "张磊",
                月台: t.taskdetail.platformname,
                车牌号: t.taskdetail.$relativeData.arrivalTask?.carNO,
                操作: ["查看"],
                id: t._id,
              };
            }),
          },
          // {
          //   title: "组板流程",
          //   list: reverse(ctx.data.unitList).map((t) => {
          //     return {
          //       任务单号: t.taskID,
          //       任务状态: t.progress?.done ? "已完成" : "进行中",
          //       商品编码: t.taskdetail.$relativeData.goods?.name,
          //       商品名称: t.taskdetail.$relativeData.goods?.goodsNo,
          //       计划上架数量: 1, // t.progress?.total,
          //       实际上架数量: t.progress?.index || 0,
          //       操作人员: "张磊",
          //       创建时间: this.formatTime(t.createTime),
          //       完成时间: this.formatTime(t.finishTime),
          //       码盘ID: t.taskdetail.storageLocationNo,
          //       操作: ["查看"],
          //       id: t._id,
          //     };
          //   }),
          // },
          {
            title: "上架流程",
            list: reverse(ctx.data.onList).map((t) => {
              return {
                任务单号: t.taskID,
                任务状态: t.progress?.done ? "已完成" : "进行中",
                商品编码: t.taskdetail.$relativeData.goods?.name,
                商品名称: t.taskdetail.$relativeData.goods?.goodsNo,
                计划上架数量: 1, // t.progress?.total,
                实际上架数量: t.progress?.index || 0,
                操作人员: "张磊",
                创建时间: this.formatTime(t.createTime),
                完成时间: this.formatTime(t.finishTime),
                上架储区: t.taskdetail.storageLocationNo,
                操作: ["查看"],
                id: t._id,
              };
            }),
          },
          {
            title: "库存流水",
            list: reverse(ctx.data.storeflowList).map((t) => {
              return {
                商品编码: t.goodsNo,
                商品名称: t.goodsName,
                储区编码: t.storageId,
                储区名称: t.storageName,
                储区类型: t.storageType,
                库存操作类型: t.type,
                商品数量: t.goodsNum,
                操作时间: this.formatTime(t.createTime),
                操作人员: t.creator,
                id: t._id,
              };
            }),
          },
          {
            title: "下架指引",
            list: reverse(ctx.data.offList).map((t) => {
              return {
                下架单号: t.taskID,
                下架单状态: t.progress?.done ? "已完成" : "进行中",
                商品编码: t.taskdetail.$relativeData.goods?.name,
                商品名称: t.taskdetail.$relativeData.goods?.goodsNo,
                供应商编码: t.taskdetail.$relativeData.manufacturerCode,
                供应商名称: t.taskdetail.$relativeData.manufacturer,
                商品数量: t.progress?.total || 1,
                实际下架数量: t.progress?.index || 0,
                创建时间: this.formatTime(t.createTime),
                完成时间: this.formatTime(t.finishTime),
                操作人员: "张磊",
                操作: ["查看"],
                id: t._id,
              };
            }),
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
