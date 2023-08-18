/**
 * 负责任务的发布
 */
const mockjs = require("mockjs");

const taskTypes = ["入园", "卸货指引", "上架指引", "下架", "出库"];
const getNextTaskType = (taskType) => {
  const index = taskTypes.indexOf(taskType);
  return taskTypes[index + 1];
};

class TaskPublish {
  constructor() {
    this.arrivalNum = 0; // 到货计划数量
    this.timer = null;
  }

  onStart(ctx) {
    this._startPublishArrivalTask(ctx); // 推送到货计划
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

    let nextTaskType = getNextTaskType(taskType);
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
      // 查询可上架货物的 ID, 暂时代替卡板号
      const goods = ctx.data.objectMap?.goodsData?.filter?.((g) => {
        console.log("goods.progressDetail", g.progressDetail);
        const res = g.progressDetail === "卸货指引完成" && !g._doing;
        return res;
      });
      const shelfSpaces = ctx.data.objectMap?.HJ_01_01_Data.map(
        (s) => s.children
      )
        .flat()
        .filter?.((s) => {
          return s.state === "可用" && !s._doing;
        })
        .slice(0, goods?.length);
      if (!shelfSpaces?.length) {
        return;
      }

      console.log(`卸货指引完成, 卡板号: `, goods, shelfSpaces);

      taskdail = goods
        .map((g, i) => {
          const storageLocationNo = shelfSpaces[i]?.ID;
          g._doing = true;
          shelfSpaces[i]._doing = true;
          return {
            cardBoardNo: g.ID, // 卡板号, 暂时用货物 ID
            storageLocationNo, // 储位号, 即货位
            weight: 1, // 权值
          };
        })
        .filter((t) => t.storageLocationNo);
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
      const taskID = ctx.helper.getId(nextTaskType);
      if (!taskID) {
        console.log("任务编号生成失败", nextTaskType);
        return;
      }
      const task = {
        tasktype: nextTaskType,
        taskID, //JD传入的任务编号
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
      ctx.data.addRecord(keyMap[nextTaskType], {
        ...task,
        msgData: payload.data,
      });
    });
  }

  // 定时推送到货计划
  _startPublishArrivalTask(ctx) {
    const publish = () => {
      const data = mockjs.mock({
        "data|6": [
          {
            商品编号: () => ctx.helper.getId("goodsNo"),
            商品类型: "空调",
            商品名称: "1.25P空调",
            商品数量: 1,
            生产厂家: "格力",
            生产日期: 44927,
            合格率: 96,
            运输货车车牌号: () => ctx.helper.getId("carNo"),
            预计到达: "", //mockjs.Random.time('HH:mm:ss'),
            _id: "@increment(1)",
          },
        ],
      });

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

      this.arrivalNum += data.data.length;

      if (this.arrivalNum >= 5 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };

    publish();
    this.timer = setInterval(publish, 4000);
  }

  onStop() {
    clearInterval(this.timer);
    this.timer = null;
    this.arrivalNum = 0;
  }
}

module.exports = TaskPublish;
