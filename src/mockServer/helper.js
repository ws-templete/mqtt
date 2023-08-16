module.exports = {
  /**
   * 根据规则获取编号
   * @param {*} name
   * @returns
   */
  getId(name) {
    const { prefix, length, step, start } = this.config.numberRules[name];
    const key = prefix + `${start}`.padStart(length, "0");
    this.config.numberRules[name].start += step;
    console.log("编号：", key, name);
    return key;
  },
};
