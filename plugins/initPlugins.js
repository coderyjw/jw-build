module.exports = function (api, options) {
  api.log.verbose("this is initPlugin");
  const { getWebpackConfig } = api;
  const config = getWebpackConfig();

  // 获取构建模式mode
  const mode = process.env.JW_BUILD_MODE || "development";
  console.log({ mode });
  config.mode(mode);
};
