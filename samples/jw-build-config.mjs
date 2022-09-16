export default {
  entry: 'index.js',
  plugins: ['jw-build-test'],
  hooks: [
    [
      "created",
      function (context) {
        console.log("this is created hook");
      }
    ]
  ]
};
