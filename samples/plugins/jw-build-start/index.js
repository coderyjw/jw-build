const message = "this is jw-build-start";

module.exports = function (api, options) {
  const { getWebpackConfig, setValue, getValue, log } = api;

  const config = getWebpackConfig();
  // 创建一个具名规则，以后用来修改规则
  // config.module
  //   .rule("lint")
  //   .test(/\.js$/)
  //   .pre()
  //   .include.add("src")
  //   .end()
  //   // 还可以创建具名use (loaders)
  //   .use("eslint")
  //   .loader("eslint-loader")
  //   .options({
  //     rules: {
  //       semi: "off"
  //     }
  //   });

  // setValue("foo", "nihao");
  log.verbose("这是jw-build-start插件");
};
