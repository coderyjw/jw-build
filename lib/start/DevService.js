const detect = require("detect-port");
const inquirer = require("inquirer");

(async () => {
  const DEFAULT_PORT = 8000;
  const params = process.argv.slice(2);
  const paramObj = {};
  params.forEach((param) => {
    const paramArr = param.split(" ");
    paramObj[paramArr[0].replace("--", "")] = paramArr[1];
  });

  let defaultPort = paramObj["port"] || DEFAULT_PORT;
  defaultPort = parseInt(defaultPort, 10);
  console.log({ defaultPort });

  try {
    const newPort = await detect(defaultPort);
    if (defaultPort == newPort) {
      const questions = {
        type: "confirm",
        name: "answer",
        message: `${defaultPort}已被占用，是否启用新的端口号`,
      };
      const answer = await inquirer.prompt(questions);

      if (!answer) {
        process.exit(1);
      }
    }
  } catch (e) {
    console.log(e);
  }

  // process.send("message from child process");
  // process.on("message", (data) => {
  //   console.log("child:", data);
  // });
})();
