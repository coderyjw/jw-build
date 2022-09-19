module.exports = {
  entry: "index.js",
  plugins: ["jw-build-test", ["jw-build-start", { a: 1, b: 2 }]],
  hooks: [
    [
      "start",
      function (context) {
        console.log("start", context);
      }
    ]
  ]
};
