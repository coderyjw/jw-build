module.exports = {
  entry: "index.js",
  plugins: ["jw-build-test"],
  hooks: [
    [
      "start",
      function (context) {
        console.log("start", context);
      }
    ]
  ]
};
