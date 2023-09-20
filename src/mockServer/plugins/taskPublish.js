const mockjs = require("mockjs");
/**
 * 负责任务的发布
 */
class TaskPublish {
  constructor() {
    this.arrivalNum = 0; // 到货计划数量
    this.timers = [];
    this.objectTaskMap = {};
  }

  onStart(ctx) {
    this._startPublishArrivalTask(ctx); // 推送到货计划
    this._startPublishUnloadTask(ctx); // 推送卸货任务
    this._startPublishUnitTask(ctx); // 推送组板任务
    this._startPublishOnTask(ctx); // 推送上架任务
  }

  onMessage(ctx, { topic, payload }) {
    if (topic !== "state" || payload.type !== "taskProgressChanged") {
      return;
    }

    // 任务完成后, 触发下一个流程
    // console.log("收到任务进度变化：", payload);

    const { tasktype, taskID, progress } = payload.data;

    // 任务完成后, 将涉及到的设备的置空
    if (progress?.done) {
      // 启动下架推送任务
      if (tasktype === "上架指引" && !this._initOffTask) {
        this._startPublishOffTask(ctx); // 推送下架任务
        // this._startPublishOutTask(ctx); // 推送出库任务
        this._initOffTask = true;
      }

      Object.entries(this.objectTaskMap).forEach(([key, value]) => {
        // 更新任务单完成时间
        payload.data.finishTime = ctx.helper.getNowTime();

        // 已经派了的货车不能再派 $trucks
        if (value.taskID === taskID && value.key !== "$trucks") {
          console.log("任务完成，释放设备", taskID, key, value);
          delete this.objectTaskMap[key];
        }
      });
    }

    ctx.data.updateTaskListByTaskType(tasktype, payload.data);
  }

  // 定时推送到货计划
  _startPublishArrivalTask(ctx) {
    const taskType = "入库单";
    const publish = () => {
      const goodssku = ctx.helper.getId("goodsNo");
      const list = mockjs.mock({
        "data|5": [
          {
            BAGNO: () => ctx.helper.getId("bagNo"), //包裹编号
            BAGSCALE: 1, //包裹规格，包裹内包含的商品数量
            goodssku, //商品sku
            goodsnum: 5, //商品数量
            goodsType: "空调",
            goodsName: "1.25P空调",
            productionDate: Date.now(),
            passRate: 96,
            manufacturer: "格力",
            manufacturerCode: "G0001",
          },
        ],
      });
      if (!Array.isArray(list.data)) {
        list.data = [list.data];
      }
      const data = mockjs.mock({
        tasktype: taskType,
        RKNO: ctx.helper.getId(taskType),
        carNO: ctx.helper.getId("carNo"),
        cartype: "一般货车",
        GOODSDTO: list.data,
      });

      // 将数据翻译一下, 因为字段名常常会变
      data.GOODSDTO = data.GOODSDTO.map((item) => {
        return {
          ...item,
          bagNo: item.BAGNO, // 包裹编号
          bagScale: item.BAGSCALE, // 包裹规格
          goodsNo: item.goodssku, // 商品编号
          goodsNum: item.goodsnum, // 商品数量
        };
      });
      // 转成统一的格式
      data.taskID = data.RKNO;
      data.taskdail = data.GOODSDTO;

      // 添加到数据库
      ctx.data.addArrivalList(data);

      console.log("推送数据 入库单", data);
      ctx.publish("active", JSON.stringify(data));

      // if (this.arrivalNum >= 5 && this.timer) {
      //   clearInterval(this.timer);
      //   this.timer = null;
      // }
    };

    // 这儿页面可能没准备好, 先延迟一下
    setTimeout(() => {
      publish();
    }, 2000);

    const timer = setInterval(publish, ctx.config.rules[taskType].interval);
    this.timers.push(timer);
  }

  /**
   * 定时推送卸货任务
   */
  _startPublishUnloadTask(ctx) {
    const taskType = "卸货指引";

    const publish = () => {
      // 获取可用的车辆
      const truck = ctx.data.objectMap.$trucks?.find?.((t) => {
        return t.state === 0 && !this.objectTaskMap[t.name];
      });
      // 检查可用的月台
      const platform = ctx.data.objectMap.$platforms?.find?.((t) => {
        return t.state === 0 && !this.objectTaskMap[t.name];
      });

      if (!truck?.name || !platform?.name || !truck.carNo) {
        console.log(
          `发布卸货指引失败，车辆或月台不可用`,
          truck,
          platform,
          this.objectTaskMap,
          ctx.data.objectMap
        );
        return;
      }

      const arrivalTask = ctx.data.arrivalList.find((item) => {
        return item.carNO === truck.carNo;
      });

      this._publishTask(
        {
          platformname: platform.name, // 月台编号
          carNO: truck.carNo, // 车牌号
          $relativeObjects: {
            $trucks: [truck.name],
            $platforms: [platform.name],
          },
          $relativeData: {
            arrivalTask,
          },
        },
        taskType,
        ctx
      );
    };

    const timer = setInterval(publish, ctx.config.rules[taskType].interval);

    this.timers.push(timer);
  }

  /**
   * 定时推送组板计划
   */
  _startPublishUnitTask(ctx) {
    const taskType = "组板指引";
    const publish = async () => {
      // 检查台账信息, 当到货计划里某个车的商品都卸货完时, 才能推送组板计划
      const arrivalItem = ctx.data.arrivalList.find((item) => {
        return !item.$isUnload;
      });

      if (!arrivalItem) return;

      const bagNos = arrivalItem.taskdail.map((t) => t.bagNo);
      // 找到所有包裹
      const goods = ctx.data.objectMap.$goods?.filter?.((t) => {
        return bagNos.includes(t.bagNo);
      });

      const isAllGoodsUnload =
        goods?.length === arrivalItem.taskdail.length &&
        goods?.every?.((g) => {
          return g.progressDetail === "卸货指引完成";
        });

      // 检查是否所有的商品都卸货完
      if (!isAllGoodsUnload) {
        console.log("组板指引失败", goods, arrivalItem, isAllGoodsUnload);
        return;
      }

      arrivalItem.$isUnload = true; // 表示该卸货单已经推送过

      goods.forEach(async (g, i) => {
        let cardBoard, bagBoardNo;
        await new Promise((resolve) => {
          let timer = setInterval(() => {
            cardBoard = ctx.data.objectMap.$cardBoards?.find?.((t) => {
              return t.state === 0 && !this.objectTaskMap[t.name];
            });
            bagBoardNo = g.bagNo;
            if (
              !cardBoard?.name ||
              !g.bagNo ||
              g.progressDetail !== "卸货指引完成"
            ) {
              console.log(
                `发布组板指引失败`,
                bagBoardNo,
                cardBoard,
                ctx.data.objectMap,
                this.objectTaskMap
              );
              return;
            }
            clearInterval(timer);
            timer = null;
            resolve(1);
          }, 2000 * i);
          this.timers.push(timer);
        });

        this._publishTask(
          {
            bagBoardNo, // 包裹编号
            storageLocationNo: cardBoard.name, // 码盘编号
            weight: 1, //权值，暂时用不到
            $relativeObjects: {
              $cardBoardsNo: [cardBoard.name],
              $goods: [g.name],
            },
            $relativeData: {
              goods: g,
            },
          },
          taskType,
          ctx
        );
      });
    };

    const timer = setInterval(publish, ctx.config.rules[taskType].interval);

    this.timers.push(timer);
  }

  // 定时推送上架任务
  _startPublishOnTask(ctx) {
    const taskType = "上架指引";

    const publish = async () => {
      // 查找组板指引完成的包裹(待上架区包裹)
      const bag = ctx.data.objectMap.$goods?.find?.((t) => {
        return (
          t.progressDetail === "组板指引完成" && !this.objectTaskMap[t.name]
        );
      });

      // 查找货架的货位
      const spaces = ctx.data.objectMap.$shelfSpaces?.filter?.((t) => {
        return t.state === 0 && !this.objectTaskMap[t.name];
      });
      const space = this.randomPickOne(spaces);

      if (!bag?.name || !space?.name || !bag.bagNo) {
        console.log(
          `发布上架指引失败，包裹或货位`,
          bag,
          space,
          this.objectTaskMap,
          ctx.data.objectMap
        );
        return;
      }

      // 增加库存流水
      ctx.data.addRecord("storeflowList", {
        goodsNo: bag.goodsNo,
        goodsName: bag.name,
        storageId: space.ID,
        storageName: space.name,
        storageType: space.bType,
        type: "入库",
        goodsNum: 1,
        createTime: ctx.helper.getNowTime(),
        creator: "张磊",
      });

      this._publishTask(
        {
          bagBoardNo: bag.bagNo, // 包裹
          storageLocationNo: space.name, // 目标货位
          weight: 1, //权值，暂时用不到
          $relativeObjects: {
            $goods: [bag.name],
            $shelfSpaces: [space.name],
          },
          $relativeData: {
            goods: bag,
            // ...goodsDto,
          },
        },
        taskType,
        ctx
      );
    };

    const timer = setInterval(publish, ctx.config.rules[taskType].interval);

    this.timers.push(timer);
  }

  // 推送下架任务
  _startPublishOffTask(ctx) {
    const taskType = "下架指引";
    const publish = async () => {
      // 查找货架的货位
      const sourceSpace = ctx.data.objectMap.$shelfSpaces?.find?.((t) => {
        return t.state === 1 && t.goodsName && !this.objectTaskMap[t.name]; // 货物货位(state=1)
      });
      const goods = ctx.data.objectMap.$goods?.find?.((t) => {
        return sourceSpace?.goodsName === t.name;
      });

      if (!sourceSpace?.name || !goods?.name) {
        console.log(
          `发布下架指引失败`,
          sourceSpace,
          goods,
          this.objectTaskMap,
          ctx.data.objectMap
        );
        return;
      }

      console.log(`下架了`);
      this._publishTask(
        {
          sourceStorageLocation: sourceSpace.name, // 起始储位
          $relativeObjects: {
            $shelfSpaces: [sourceSpace.name],
            $goods: [goods.name],
          },
          $relativeData: {
            goods,
          },
        },
        taskType,
        ctx
      );
    };

    const timer = setInterval(publish, ctx.config.rules[taskType].interval);

    this.timers.push(timer);
  }

  // // 推送出库任务
  // _startPublishOutTask(ctx) {
  //   const taskType = "出库指引";
  //   const publish = async () => {
  //     // 查找下架完成的货物
  //     const goods = ctx.data.objectMap.$goods?.find?.((t) => {
  //       return (
  //         t.progressDetail === "下架指引完成" && !this.objectTaskMap[t.name]
  //       );
  //     });

  //     if (
  //       !goods?.name
  //       // !agvCar?.name
  //     ) {
  //       console.log(
  //         `发布出库指引失败`,
  //         goods,
  //         this.objectTaskMap,
  //         ctx.data.objectMap
  //       );
  //       return;
  //     }

  //     this._publishTask(
  //       {
  //         goodsNo: goods.name, //商品名称
  //         goodsNum: 1, //商品数量
  //         $relativeObjects: {
  //           $goods: [goods.name],
  //         },
  //         $relativeData: {
  //           goods,
  //         },
  //       },
  //       taskType,
  //       ctx
  //     );
  //   };

  //   const timer = setInterval(publish, ctx.config.rules[taskType].interval);

  //   this.timers.push(timer);
  // }

  _publishTask(taskdail, taskType, ctx) {
    // 发布任务
    if (!Array.isArray(taskdail)) {
      taskdail = [taskdail];
    }

    taskdail.forEach((item) => {
      const taskID = ctx.helper.getId(taskType);
      if (!taskID) {
        console.log("任务编号生成失败", taskType);
        return;
      }
      const relativeObjects = item.$relativeObjects;

      const task = {
        tasktype: taskType,
        taskID, //JD传入的任务编号
        taskdail: item,
        createTime: ctx.helper.getNowTime(),
        // 卸货单关联的到货任务
        relativeData: null,
      };

      // 记录所用的设备, 表示已经派了任务
      Object.entries(relativeObjects).forEach(([key, value]) => {
        value.forEach((name) => {
          this.objectTaskMap[name] = {
            taskID,
            key, // 数据库中的 key
          };
        });
      });

      ctx.data.updateTaskListByTaskType(
        taskType,
        JSON.parse(JSON.stringify(task))
      );

      delete item.$relativeObjects;
      delete item.$relativeData;
      console.log("发布任务：", taskID, task);
      ctx.publish("active", task);
    });
  }

  onStop() {
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
    this.timers = [];
    this.objectTaskMap = {};
  }

  randomPickOne(objs) {
    return objs?.sort(() => {
      return Math.random() - 0.5;
    })?.[0];
  }

  onStop() {
    clearInterval(this.timer);
    this.timer = null;
    this.arrivalNum = 0;
  }
}

module.exports = TaskPublish;
