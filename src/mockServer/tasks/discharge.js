/**
 * 模拟发送卸货任务
 */
class Discharge {
  static taskTypes = ["入园", "卸货指引", "上架"];
  static getNextTaskType(taskType) {
    const index = Discharge.taskTypes.indexOf(taskType);
    return Discharge.taskTypes[index + 1];
  }
  onMessage(ctx, { topic, payload }) {
    // console.log("当前topic：", topic, payload);

    // 三维中的数据
    if (topic !== "state") {
      return;
    }

    if (payload.type !== "taskProgressDone") {
      return;
    }

    // 任务完成后, 触发下一个流程
    console.log("内容：", payload);

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
      const taskRecord = ctx.data
        .getTaskList()
        .find((t) => t.taskID === taskNo);
      console.log(`taskRecord`, taskRecord);

      if (!taskRecord) return;
      // 根据 record.taskdail.trainNo 获取到货计划中的商品数量和商品编号
      const order = ctx.data.getArrivalOrderList().find((item) => {
        return item.运输货车车牌号 === taskRecord.msgData.carNo;
      });

      console.log("order", order);
      if (!order) return;
      // taskdail = {
      //   goodsNum: order.商品数量,
      //   goodsNo: order.商品编号,
      //   // cardBoardNo: 1, // 卡板号
      //   // storageLocationNo: 1, // 储位号
      //   // weight: 1, // 权值
      // };
      taskdail = Array(order.商品数量)
        .fill(null)
        .map(() => {
          return {
            goodsNo: order.商品编号,
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

      ctx.data.addTaskList({ ...task, msgData: payload.data });
    });
  }
  onStop() {}
}

module.exports = Discharge;
