const pkgJson = require("./package.json");

module.exports = {
  apps: [
    {
      name: pkgJson.name,
      script: "./index.js",
      watch: ["src", "index.js"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules", "data"],
    },
  ],
};
