module.exports = {
  /**
   * 根据规则获取编号
   * @param {*} name
   * @returns
   */
  getId(name) {
    const rules = this.config.numberRules?.[name];
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
};
