console.log("DevService");
console.log("child pid", process.pid);
console.log("child ppid", process.ppid);
console.log("child argv", process.argv);

process.send("message from child process");
process.on("message", (data) => {
  console.log("child:", data);
});
