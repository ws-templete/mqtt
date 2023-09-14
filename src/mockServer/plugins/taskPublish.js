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
    this._startPublishOnTask(ctx); // 推送上架任务
    this._startPublishOffTask(ctx); // 推送下架任务
    // this._startPublishOutTask(ctx); // 推送出库任务
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

    const { tasktype, taskID, progress } = payload.data;

    // 任务完成后, 将涉及到的设备的置空
    if (progress?.done) {
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
    const publish = () => {
      const data = {
        商品编号: ctx.helper.getId("goodsNo"),
        商品类型: "空调",
        商品名称: "1.25P空调",
        商品数量: 1,
        生产厂家: "格力",
        生产日期: 44927,
        合格率: 96,
        运输货车车牌号: ctx.helper.getId("carNo"),
        预计到达: "", //mockjs.Random.time('HH:mm:ss'),
      };

      // 添加到数据库
      ctx.data.addArrivalList(data);

      ctx.publish(
        "active",
        JSON.stringify({
          tasktype: "到货计划",
          taskNo: ctx.helper.getId("到货计划"),
          taskdail: data,
        })
      );

      // if (this.arrivalNum >= 5 && this.timer) {
      //   clearInterval(this.timer);
      //   this.timer = null;
      // }
    };

    publish();
    const timer = setInterval(publish, 10000);
    this.timers.push(timer)
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
      
      if (!truck?.name || !platform?.name) {
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
          carNO: truck.name, // 车牌号
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

  // 定时推送上架任务
  _startPublishOnTask(ctx) {
    const taskType = "上架指引";

    const publish = async () => {
      // 查找组板指引完成的包裹(待上架区包裹)
      const bag = ctx.data.objectMap.$goods?.find?.((t) => {
        return (
          t.progressDetail === "卸货指引完成" && !this.objectTaskMap[t.name]
        );
      });

      // 查找货架的货位
      const space = ctx.data.objectMap.$shelfSpaces?.find?.((t) => {
        return t.state === 0 && !this.objectTaskMap[t.name];
      });

      if (!bag?.name || !space?.name) {
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
          bagBoardNo: bag.name, // 包裹
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
        return t.state === 1 && !this.objectTaskMap[t.name]; // 货物货位(state=1)
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
          ctx.data.objectMap,
        );
        return;
      }

      console.log(`下架了`, )
      this._publishTask(
        {
          sourceStorageLocation: sourceSpace.name, // 起始储位
          $relativeObjects: {
            $shelfSpaces: [sourceSpace.name],
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

  // 推送出库任务
  _startPublishOutTask(ctx) {
    const taskType = "出库指引";
    const publish = async () => {
      // 查找零拣区有货物的货位
      const space = ctx.data.objectMap.$pickingSpaces?.find?.((t) => {
        return t.state === 1 && !this.objectTaskMap[t.name];
      });

      const goods = ctx.data.objectMap.$goods?.find?.((t) => {
        return space?.goodsName === t.name;
      });

      // const agvCars = ctx.data.objectMap.$agvCars?.filter?.((t) => {
      //   return (
      //     t.state === 0 &&
      //     !this.objectTaskMap[t.name] &&
      //     ctx.data.objectRelationShip?.[t.ID]?.startsWith("QY_01_04")
      //   );
      // });
      // const agvCar = this.randomPickOne(agvCars);

      // 查找零拣区区域内的工具
      const worker = ctx.data.objectMap.$workers?.find?.((t) => {
        return (
          t.state === 0 &&
          // !this.objectTaskMap[t.name] && // 所有的锁都有问题, 流程太长时, 会导致锁必须等结束才能释放
          ctx.data.objectRelationShip?.[t.ID]?.startsWith("QY_02_04") // 先写死
        );
      });

      // 发货道口, 这儿要根据订单地址来, 先随机
      const outboundTunnel = this.randomPickOne(
        ctx.data.objectMap.$unloadStorageArea
      );

      if (
        !space?.name ||
        !worker?.name ||
        !outboundTunnel?.name
        // !agvCar?.name
      ) {
        console.log(
          `发布出库指引失败`,
          space,
          // agvCar,
          worker,
          outboundTunnel,
          this.objectTaskMap,
          ctx.data.objectMap
        );
        return;
      }

      // 增加库存流水
      ctx.data.addRecord("storeflowList", {
        goodsNo: goods.goodsNo,
        goodsName: goods.name,
        storageId: space.ID,
        storageName: space.name,
        storageType: space.bType,
        type: "出库",
        goodsNum: 1,
        createTime: ctx.helper.getNowTime(),
        creator: "张磊",
      });

      this._publishTask(
        {
          sku: "SKU123456", //商品sku
          quantity: 6, //数量
          outboundComponent: "component1", //出库组件
          outboundLocation: space.name, //出库储位
          outboundTunnel: outboundTunnel.name, //出库道口, 根据订单地址来, 先随机
          toolname: [worker.name], // 工具
          $relativeObjects: {
            $pickingSpaces: [space.name],
            $workers: [worker.name],
            // $agvCars: [agvCar.name],
            $unloadStorageArea: [outboundTunnel.name],
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
