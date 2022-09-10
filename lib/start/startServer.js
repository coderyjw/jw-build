const chokidar = require("chokidar");
const path = require("path");

const runServer = () => {
  // 启动webpack服务
};

const onChange = () => {
  console.log("change");
};

const runWatcher = () => {
  const configPath = path.resolve(__dirname, "./config.json");
  const watcher = chokidar.watch(configPath).on("change", onChange);
  watcher.on("error", (error) => {
    console.error("file watch error!", error);
    process.exit(1);
  });
};

module.exports = function start(arg, opts, cmd) {
  // 1. 通过子进程启动webpack-dev-server服务
  // 1.1 子进程启动可以避免主进程受到影响
  // 1.2 子进程启动方便重启，解决配置修改后无法启动
  runServer();
  runWatcher();
};