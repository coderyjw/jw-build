const chokidar = require("chokidar");
const path = require("path");

const runServer = () => {
  // 启动webpack服务
};

const runWatcher = () => {
  const configPath = path.resolve(process.cwd(), "lib/start");
  chokidar.watch(configPath).on("all", (eventName, path, details) => {
    console.log({ eventName, path, details });
  });
};

module.exports = function start(arg, opts, cmd) {
  // 1. 通过子进程启动webpack-dev-server服务
  // 1.1 子进程启动可以避免主进程受到影响
  // 1.2 子进程启动方便重启，解决配置修改后无法启动
  runServer();
  runWatcher();
};
