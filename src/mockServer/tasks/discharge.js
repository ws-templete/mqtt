/**
 * 模拟发送卸货任务
 */
class Discharge {
  static taskTypes = ["入园", "卸货指引", "上架指引", "下架", "出库"];
  static getNextTaskType(taskType) {
    const index = Discharge.taskTypes.indexOf(taskType);
    return Discharge.taskTypes[index + 1];
  }
  onMessage(ctx, { topic, payload }) {
    if (topic !== "state") {
      return;
    }

    if (payload.type !== "taskProgressDone") {
      return;
    }

    // 任务完成后, 触发下一个流程
    // console.log("内容：", payload);

    const { taskType, taskNo } = payload.data;

    let nextTaskType = Discharge.getNextTaskType(taskType);
    let taskdail = {};

    // 发布卸货任务
    if (taskType === "入园") {
      taskdail = {
        platformCode: "", // 月台编号
        trainNo: payload.data.carId, // 车牌号
      };
    }

    // 发布上架任务
    if (taskType === "卸货指引") {
      // 根据卸货车牌号, 获取卸货的商品数量和商品编号
      // const carId =
      const taskRecord = ctx.data.unloadList.find((t) => t.taskID === taskNo);
      // console.log(`taskRecord`, taskRecord);

      if (!taskRecord) return;
      // 根据 record.taskdail.trainNo 获取到货计划中的商品数量和商品编号
      const order = ctx.data.arrivalList.find((item) => {
        return item.运输货车车牌号 === taskRecord.msgData.carNo;
      });

      console.log("order", order);
      if (!order) return;
      // taskdail = {
      //   goodsNum: order.商品数量,
      //   goodsNo: order.商品编号,
      //   // cardBoardNo: 1, // 卡板号
      // };
      taskdail = Array(order.商品数量)
        .fill(null)
        .map(() => {
          return {
            // cardBoardNo: 1, // 卡板号, 暂时用货物 ID
            // storageLocationNo: 1, // 储位号, 即货位
            // weight: 1, // 权值
            goodsNo: order.商品编号,
            goodsNum: 1,
          };
        });
    }

    // 发布下架任务
    if (taskType === "上架指引") {
      taskdail = {
        goodsNo: "SP_99_10_0001",
        goodsNum: 1,
      };
    }

    // 发布出库任务
    if (taskType === "下架") {
      taskdail = Array(5)
        .fill(null)
        .map(() => {
          return {
            goodsNo: "SP_99_10_0001",
            goodsNum: 1,
          };
        });
    }

    // 发布任务
    if (!Array.isArray(taskdail)) {
      taskdail = [taskdail];
    }
    taskdail.forEach((item) => {
      const task = {
        tasktype: nextTaskType,
        taskID: ctx.helper.getId(nextTaskType), //JD传入的任务编号
        taskdail: item,
      };
      console.log("发布任务：", task);
      ctx.publish("active", task);

      const keyMap = {
        卸货指引: "unloadList",
        上架指引: "onList",
        下架: "offList",
        出库: "outList",
      };
      console.debug(`任务类型：${nextTaskType}`, keyMap[nextTaskType]);
      ctx.data.addRecord(keyMap[nextTaskType], { ...task, msgData: payload.data });
    });
  }

  onStop() {}
}

module.exports = Discharge;
