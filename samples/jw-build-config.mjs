export default {
  entry: "index.js",
  plugins: ["jw-build-test"],
  hooks: [
    [
      "start",
      function (context) {
        context.log.verbose("这是一个hook: start");
      }
    ]
  ]
};
