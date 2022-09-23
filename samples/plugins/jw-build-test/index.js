const path = require("path");
module.exports = function (api, options) {
  const { getWebpackConfig, setValue, getValue, emitHooks, log } = api;

  const config = getWebpackConfig();
  // config
  //   // 修改 entry 配置
  //   .entry("login")
  //   .add(path.resolve(process.cwd(), "src/login.js"))
  //   .end()
  //   // 修改 output 配置
  //   .output.path("dist")
  //   .filename("[name].bundle.js");

  // setValue("name", "coder");
  // emitHooks("pluginHook");
  log.verbose("这是jw-build-test插件");
};
