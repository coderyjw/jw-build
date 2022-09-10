const detect = require("detect-port");
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
      console.log(`port: ${defaultPort} was not occupied`);
    } else {
      console.log(`port: ${defaultPort} was occupied, try port: ${newPort}`);
    }
  } catch (e) {
    console.log(e);
  }

  // process.send("message from child process");
  // process.on("message", (data) => {
  //   console.log("child:", data);
  // });
})();
