/**
 * 更新数据库的物体状态数据
 */
class ObjectMap {
  onMessage(ctx, { topic, payload }) {
    if (topic === "state" && payload.type === "objectState") {
      console.log(`objectState`, payload);

      ctx.data.updateObjectMap(payload.data);
    }
  }

  onStop() {}
}

module.exports = ObjectMap;
