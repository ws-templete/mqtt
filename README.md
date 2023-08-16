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

> 开发时可以加 --watch 参数，修改文件后自动重启

3. 查看日志

```sh
pm2 logs --out --lines 100
```