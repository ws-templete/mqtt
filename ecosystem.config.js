const pkgJson = require("./package.json");

module.exports = {
  apps: [
    {
      name: pkgJson.name,
      script: "./index.js",
      watch: ["src", "index.js"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs"],
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // out_file: "./logs/pm2-out.log",
      merge_logs: true,
      error_file: "./logs/pm2-error.log",
      // raw_logs: true,
    },
  ],
};
