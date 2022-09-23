module.exports = {
  entry: "index.js",
  plugins: [
    "./plugins/jw-build-test",
    ["./plugins/jw-build-start", { a: 1, b: 2 }],
  ],
  hooks: [
    [
      "start",
      function (context) {
        context.log.verbose("这是一个start hook");
      },
    ],
    [
      "pluginHook",
      function (context) {
        // context.log.verbose("这是一个hook: pluginHook");
      },
    ],
  ],
};
