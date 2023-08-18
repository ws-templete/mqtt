# jd-mqtt

## 使用

1、安装依赖 pm2

```sh
npm install pm2 -g
```

2. 启动服务

```sh
pm2 start ecosystem.config.js
```

> 配置文件中已经加了 watch 参数，修改文件后自动重启

3. 查看日志

```sh
pm2 logs --out --lines 100
```

4. 使用 Chrome 查看 log 或调试: 打开 http://localhost:8090, 点击调试面板的左下角 "Open dedicated DevTools for Node" 按钮。
