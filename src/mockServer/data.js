const { v4: uuidv4 } = require('uuid');

/**
 * Database storage
 */
const taskDataKeyMap = {
  到货计划: "arrivalList",
  卸货指引: "unloadList",
  上架指引: "onList",
  组板指引: "unitList",
  出库指引: "offList",
  // 出库指引: "outList",
};

const actions = {
  setArrivalList(value) {
    this.arrivalList = value;
  },
  addArrivalList(value) {
    value._id = uuidv4()
    this.arrivalList.push(value);
  },
  addTaskList(value) {
    value._id = uuidv4()
    this.taskList.push(value);
  },
  addRecord(key, value) {
    value._id = uuidv4()
    this[key].push(value);
  },
  // 更新任务, 没有则创建
  updateTaskListByTaskType(taskType, value) {
    const key = taskDataKeyMap[taskType];
    if (!this[key]) {
      console.error(`没有找到  this[${key}]`);
      return;
    }

    const index = this[key].findIndex((item) => item.taskID === value.taskID);
    if (index === -1) {
      console.warn("没有找到要更新的任务, 将会新增", value.taskID);
      value._id = uuidv4()
      this[key].push(value);
      return;
    }
    Object.assign(this[key][index], value);
  },
  updateObjectMap(data) {
    Object.entries(data).forEach(([key, value]) => {
      // 没有该字段, 则添加
      if (!this.objectMap[key]) {
        this.objectMap[key] = value;
      } else {
        value.forEach((_val) => {
          // 有该字段, 则更新
          const item = this.objectMap[key]?.find?.(
            (item) => item.ID === _val.ID
          );

          // 货架单独处理, 因为有子节点
          if (objectKeyMap[key] === "$shelfs") {
            // 找到 item 的 children 中相同项目替换
            item.children?.forEach?.((c1) => {
              _val.children?.forEach?.((c2) => {
                if (c1.ID === c2.ID) {
                  Object.assign(c1, c2);
                }
              });
            });

            _val = item;
          }

          if (!item) {
            console.warn("没有找到该数据", key, _val);
            this.objectMap[key]?.push?.(_val);
          } else {
            Object.assign(item, _val);
          }
        });
      }
      // 给数据的 key 重新映射一下, 因为台账数据 key 可能随时会被修改
      const newKey = objectKeyMap[key];
      this.objectMap[newKey] = this.objectMap[key];
    });
  },
};

// 对象 key 和台账数据的映射, 加上 $ 前缀
const objectKeyMap = {
  car_01_01_Data: "$trucks", // 卸货货车
  goodsData: "$goods", // 货物
  tcw_01_01_Data: "$truckParkSpaces", // 货车停车位
  tcw_01_02_Data: "$platforms", // 卸货月台
  agv_01_01_Data: "$agvCars", // 叉车
  goodsstowData: "$cardBoards", // 码盘
  unloadStorageAreaData: "$unloadStorageArea", // 卸货暂存区
  workerData: "$workers", // 工人
  HJ_01_01_Data: "$shelfs", // 货架
};

module.exports = {
  clone() {
    const data = {
      taskList: [],
      arrivalList: [], // 到货计划列表
      unloadList: [], // 卸货任务列表
      onList: [], // 上架任务列表
      offList: [], // 下架任务列表
      // outList: [], // 出库任务列表
      unitList: [], // 组板任务列表",

      storeflowList: [], // 库存流水列表
      objectMap: {
        // 新增一个货架货位字段, 方便查询
        get $shelfSpaces() {
          return this.$shelfs?.map((s) => [...s.children])?.flat?.() || [];
        },
      },
    };

    Reflect.setPrototypeOf(data, actions);

    return data;
  },
};
