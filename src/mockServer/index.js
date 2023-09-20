// 任务推送接口
const fs = require("fs-extra");
const helper = require("./helper");
const config = require("./config");
const data = require("./data");
class MockServer {
  constructor(client) {
    this.ctx = this.createCtx(client);

    const plugins = fs.readdirSync(__dirname + "/plugins");
    this.plugins = plugins.map((task) => {
      const T = require("./plugins/" + task); // ({ client, config, helper, db });
      return new T();
    });

    this.plugins.forEach((t) => {
      t.onCreated?.call(t, this.ctx);
    });
  }

  createCtx(client) {
    const ctx = {
      client, // 客户端
      config: config.clone(), // 每个客户端的配置
      data: data.clone(), // 每个客户端的运行时数据
    };
    ctx.helper = this._bindCtxHelper(helper, ctx); // 扩展辅助函数, 每个 ctx 都有自己的 helper 实例
    ctx.publish = this._wrapClientPublish(client); // 扩展 publish 方法

    return ctx;
  }

  // 由于 client publish 方法较复杂, 所以改写下
  _wrapClientPublish(client) {
    return (topic, payload, options) => {
      return client.publish(
        {
          topic,
          payload:
            typeof payload === "string" ? payload : JSON.stringify(payload),
          ...options,
        },
        function (err) {
          if (err) {
            console.error("Failed to publish message:", err);
          } else {
            // console.log("Message published successfully", topic, payload);
          }
        }
      );
    };
  }

  /**
   * helper 独立, 不共享, 因为 ctx 是每个客户端独立的
   * @param {Object} helper 方法
   * @param {Object} ctx 上下文
   * @returns 新的 helper
   */
  _bindCtxHelper(helper, ctx) {
    const _helper = {};
    // console.log("bind helper", helper, ctx);
    Object.entries(helper).forEach(([fnName, fn]) => {
      if (typeof fn === "function") {
        _helper[fnName] = fn.bind(ctx);
      }
    });
    return _helper;
  }

  /**
   * 启动时
   */
  start() {
    this.plugins.forEach((t) => {
      t.onStart?.call(t, this.ctx);
    });
  }

  /**
   * 收到消息时
   */
  message(topic, payload, packet) {
    this.plugins.forEach((t) => {
      try {
        t.onMessage?.call(t, this.ctx, {
          topic,
          payload: JSON.parse(payload.toString()),
        });
      } catch (e) {
        console.error(e);
      }
    });
    console.log("this.ctx", this.ctx);
  }

  /**
   * 停止时
   */
  stop() {
    this.plugins.forEach((t) => {
      t.onStop?.call(t, this.ctx);
    });
  }
}

module.exports = (aedes) => {
  // 客户端连接
  aedes.on("clientReady", function (client) {
    const url = client.req?.url;
    console.log('url', url)
    if (!url?.includes("?mode=1")) return; // 只要仿真模式下才推送数据
    const mockServer = new MockServer(client);
    client.mockServer = mockServer;
    mockServer.start(client);
  });

  aedes.on("publish", function (packet, client) {
    if (packet.cmd === "publish" && client?.id && client?.mockServer) {
      client.mockServer.message(packet.topic, packet.payload, packet);
    }
  });

  // 客户端断开
  aedes.on("clientDisconnect", function (client) {
    console.log("客户端断开了.......", client.id);
    if (client.mockServer) {
      client.mockServer.stop();
      client.mockServer = null;
    }
  });
};

process.on("uncaughtException", function (err) {
  console.error("uncaughtException", err);
});
