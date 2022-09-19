const detect = require("detect-port");
const inquirer = require("inquirer");
const Service = require("../service/service");
const log = require("../utils/log");

(async () => {
  // 参数解析
  const DEFAULT_PORT = 8000;
  const params = process.argv.slice(2);
  const paramObj = {};

  params.forEach((param) => {
    const paramArr = param.split(" ");
    paramObj[paramArr[0].replace("--", "")] = paramArr[1];
  });
  log.verbose("devService子进程参数解析", paramObj);

  // 获取port参数
  const { config = "" } = paramObj;
  let defaultPort = paramObj["port"] || DEFAULT_PORT;
  defaultPort = parseInt(defaultPort, 10);

  try {
    // 判断端口号是否占用
    log.verbose(`devService子进程,判断${defaultPort}端口号是否占用`);

    const newPort = await detect(defaultPort);
    if (defaultPort !== newPort) {
      log.verbose(`devService子进程,${defaultPort}端口号已被占用`);
      // 端口号被占用 将port + 1 再去判断
      const questions = {
        type: "confirm",
        name: "answer",
        message: `${defaultPort}已被占用，是否启用新的端口号${newPort}`
      };
      const answer = (await inquirer.prompt(questions)).answer;
      if (!answer) {
        // 结束进程
        log.verbose(`不启用新的端口号，结束进程`);
        process.exit(1);
      }
    }
    // 端口号没被占用 实例化Service对象
    log.verbose(`devService子进程,${defaultPort}端口号未被占用，实例化Service对象`);
    const args = {
      port: newPort,
      config
    };
    const service = new Service(args);
    service.start();
  } catch (e) {
    log.error(e);
  }

  // process.send("message from child process");
  // process.on("message", (data) => {
  //   console.log("child:", data);
  // });
})();
