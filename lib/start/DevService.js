const detect = require("detect-port");
const inquirer = require("inquirer");
const Service = require("../service/service");
const log = require("../utils/log");

(async () => {
  const DEFAULT_PORT = 8000;
  const params = process.argv.slice(2);
  const paramObj = {};

  params.forEach((param) => {
    const paramArr = param.split(" ");
    paramObj[paramArr[0].replace("--", "")] = paramArr[1];
  });

  const { config = "" } = paramObj;
  let defaultPort = paramObj["port"] || DEFAULT_PORT;
  defaultPort = parseInt(defaultPort, 10);

  try {
    const newPort = await detect(defaultPort);
    if (defaultPort !== newPort) {
      // 命令行家平湖
      const questions = {
        type: "confirm",
        name: "answer",
        message: `${defaultPort}已被占用，是否启用新的端口号${newPort}`,
      };
      const answer = (await inquirer.prompt(questions)).answer;
      if (!answer) {
        process.exit(1);
      }
    }

    const args = {
      port: newPort,
      config,
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
