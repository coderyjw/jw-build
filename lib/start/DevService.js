const DEFAULT_PORT = 8000
const params = process.argv.slice(2);
const paramObj = {};
params.forEach((param) => {
  const paramArr = param.split(" ");
  paramObj[paramArr[0].replace("--", "")] = paramArr[1];
});
console.log({ paramObj });
// process.send("message from child process");
// process.on("message", (data) => {
//   console.log("child:", data);
// });
