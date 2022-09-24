const message = "this is jw-build-start";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = function (api, options) {
  const { getWebpackConfig, setValue, getValue, log } = api;

  const config = getWebpackConfig();
  const dir = process.cwd();

  config.plugin("HtmlWebpackPlugin2").use(HtmlWebpackPlugin, [
    {
      filename: "login.html",
      template: path.resolve(dir, "./public/login.html"),
      chunks: ["login"],
    },
  ]);

  // setValue("foo", "nihao");
  log.verbose("这是jw-build-start插件");
};
