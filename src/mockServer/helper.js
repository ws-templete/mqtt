module.exports = {
  /**
   * 根据规则获取编号
   * @param {*} name
   * @returns
   */
  getId(name) {
    const rules = this.config.rules?.[name];
    if (!rules) {
      console.error(`编号规则不存在：${name}`);
      return;
    }
    const { prefix, length, step, start } = rules;
    const key = prefix + `${start}`.padStart(length, "0");
    rules.start += step;
    console.log("编号：", key, name);
    return key;
  },
  // 获取当前时间, 格式为 yyyy-M-d HH:mm:ss
  getNowTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const pad0 = (num) => num.toString().padStart(2, "0");
    return `${year}-${month}-${day} ${pad0(hour)}:${pad0(minute)}:${pad0(
      second
    )}`;
  },
};
