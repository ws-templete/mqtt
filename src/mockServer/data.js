/**
 * Database storage
 */
module.exports = {
  clone() {
    const _data = {
      taskList: [],
      arrivalOrderList: [],
    };

    return {
      getArrivalOrderList() {
        return _data.arrivalOrderList;
      },
      setArrivalOrderList(value) {
        _data.arrivalOrderList = value;
      },
      addArrivalOrderList(value) {
        _data.arrivalOrderList.push(value);
      },
      getTaskList() {
        return _data.taskList;
      },
      addTaskList(value) {
        _data.taskList.push(value);
      },
    };
  },
};
