const path = require("path");
module.exports = function (api, options) {
  const { getWebpackConfig, log } = api;
  const config = getWebpackConfig();
  const dir = process.cwd();
  // 获取构建模式mode
  const mode = process.env.JW_BUILD_MODE || "development";
  config.mode(mode);

  // 设置entry
  config.entry("index").add(path.resolve(dir, "./src/index.js")).end();

  // 设置output
  config.output.filename("js/[name].js").path(path.resolve(dir, "./dist"));

  log.verbose("内置webpack配置", config.toConfig());
};
