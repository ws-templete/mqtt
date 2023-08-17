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

      goodsList: [],
    };

    Reflect.setPrototypeOf(data, actions);

    return data;
  },
};
