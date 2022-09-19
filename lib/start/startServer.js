const chokidar = require("chokidar");
const path = require("path");
const cp = require("child_process");
const log = require("../utils/log");
const { getConfigFile } = require("../utils/index");

const childPath = path.resolve(__dirname, "./DevService.js");
let child;

// 启动子进程DevService
const runServer = (args = {}) => {
  log.verbose("runServer: 启动子进程DevService", args);
  const { config = "" } = args;
  child = cp.fork(childPath, ["--port 8080", `--config ${config}`]);
  child.on("exit", (code) => {
    log.verbose("runServer: 子进程监听exit方法", code);
    if (code) {
      process.exit(code);
    }
  });
  // child.on("message", (data) => {
  //   // 接收来自子进程的消息
  //   console.log("main:", data);
  // });
  // child.send("message from main");
};

const onChange = () => {
  /* 配置文件发生修改重启子进程 */
  log.verbose("onChange: 配置文件发生修改重启子进程");
  child.kill();
  runServer();
};

const runWatcher = () => {
  log.verbose("runWatcher: 监听配置文件改变");
  const configPath = getConfigFile();
  const watcher = chokidar.watch(configPath).on("change", onChange);
  watcher.on("error", (error) => {
    log.error("file watch error!", error);
    process.exit(1);
  });
};

module.exports = function start(opts, cmd) {
  // 1. 通过子进程启动webpack-dev-server服务
  // 1.1 子进程启动可以避免主进程受到影响
  // 1.2 子进程启动方便重启，解决配置修改后无法启动
  log.verbose("执行命令: start");
  runServer(opts);
  /* 监听配置文件的修改 */
  runWatcher();
};
