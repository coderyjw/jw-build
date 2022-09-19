module.exports = {
  entry: "index.js",
  plugins: ["jw-build-test", ["jw-build-start", { a: 1, b: 2 }]],
  hooks: [
    [
      "start",
      function (context) {
        context.log.verbose("这是一个hook: start");
      }
    ],
    [
      "pluginHook",
      function (context) {
        context.log.verbose("这是一个hook: pluginHook");
      }
    ]
  ]
};
