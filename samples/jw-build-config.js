module.exports = {
  entry: "index.js",
  plugins: ["jw-build-test"],
  hooks: [
    [
      "created",
      function (context) {
        console.log("this is created hook");
      }
    ],
    [
      "configResolved",
      (context) => {
        console.log("this is configResolvef");
      }
    ]
  ]
};
