class DataUpdate {
  constructor() {}

  onMessage(ctx, { topic, payload }) {
    // console.log("收到消息", topic, payload);
  }

  onStop() {}
}

module.exports = DataUpdate;
