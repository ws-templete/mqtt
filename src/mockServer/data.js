/**
 * Database storage
 */
const actions = {
  setArrivalList(value) {
    this.arrivalList = value;
  },
  addArrivalList(value) {
    this.arrivalList.push(value);
  },
  addTaskList(value) {
    this.taskList.push(value);
  },
  addRecord(key, value) {
    this[key].push(value);
  },
  updateObjectMap(value) {
    Object.entries(value).forEach(([key, value]) => {
      // 没有该字段, 则添加
      if (!this.objectMap[key]) {
        console.log("添加字段", key, value, this.objectMap[key])
        this.objectMap[key] = value;
      } else {
        // 有该字段, 则更新
        const item = this.objectMap[key].find((item) => item.ID === value.ID);
        if (!item) {
          this.objectMap[key].push(value);
        } else {
          Object.assign(item, value);
        }
      }
    });
  },
};

module.exports = {
  clone() {
    const data = {
      taskList: [],
      arrivalList: [], // 到货计划列表
      unloadList: [], // 卸货任务列表
      onList: [], // 上架任务列表
      offList: [], // 下架任务列表
      outList: [], // 出库任务列表

      objectMap: {},
    };

    Reflect.setPrototypeOf(data, actions);

    return data;
  },
};
