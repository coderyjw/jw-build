export default {
  entry: "index.js",
  plugins: ["./plugins/jw-build-test"],
  hooks: [
    [
      "start",
      function (context) {
        context.log.verbose("这是一个hook: start");
      }
    ]
  ]
};
