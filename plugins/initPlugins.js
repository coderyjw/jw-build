const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function (api, options) {
  const { getWebpackConfig, log } = api;
  const config = getWebpackConfig();
  const dir = process.cwd();
  // 获取构建模式mode
  const mode = process.env.JW_BUILD_MODE || "development";
  config.mode(mode);

  /* 设置entry */
  config.entry("index").add(path.resolve(dir, "./src/index.js")).end();

  /* 设置output */
  config.output.filename("js/[name].js").path(path.resolve(dir, "./dist"));

  /* 设置module */
  // 1. css-loader mini-css
  config.module
    .rule("css")
    .test(/\.css$/)
    .exclude.add("/node_modules/")
    .end()
    .use("mini-css")
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use("css-loader")
    .loader("css-loader")
    .end();

  // 2. 图片
  config.module
    .rule("asset")
    .test(/\.(png|jpe?g|svg|gif)$/i)
    .type("asset")
    .parser({
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    });

  config.module.rule("asset").set("generator", {
    filename: "images/[name].[hash:6][ext]",
  });

  // 3. ejs
  config.module
    .rule("ejs")
    .test(/\.ejs$/)
    .exclude.add("/node_modules/")
    .end()
    .use("ejs-loader")
    .loader("ejs-loader")
    .options({
      esModule: false,
    });

  log.verbose("内置webpack配置", config.toConfig());
};
