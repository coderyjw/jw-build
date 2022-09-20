#!/usr/bin/env node

const { checkDebug } = require("../lib/utils/index");

const { program } = require("commander");
const checkNode = require("../lib/checkNode");
const pkg = require("../package.json");
const startServer = require("../lib/start/startServer");
const buildServer = require("../lib/build/build");
const MIN_NODE_VERSION = "8.9.0";
const log = require("../lib/utils/log");

(async () => {
  try {
    await checkDebug();
    log.verbose("检查node版本号>=", MIN_NODE_VERSION);
    if (!checkNode(">=" + MIN_NODE_VERSION)) {
      throw new Error("Please upgrade your node version to v") + MIN_NODE_VERSION;
    }

    program.version(pkg.version);

    log.verbose("注册命令: start");
    program
      .command("start")
      .option("-c, --config <config>", "配置文件路径")
      .option("--custom-webpack-path <customWebpackPath>", "自定义webpack路径")
      .description("start service by jw-build")
      .allowUnknownOption()
      .action(startServer);

    log.verbose("注册命令: build");
    program
      .command("build")
      .option("-c, --config <config>", "配置文件路径")
      .option("--custom-webpack-path <customWebpackPath>", "自定义webpack路径")
      .description("build service by jw-build")
      .allowUnknownOption()
      .action(buildServer);

    log.verbose("注册全局option: debug");
    program.option("-d, --debug", "开启调试模式");

    log.verbose("开始命令解析");
    program.parse(process.argv);
  } catch (e) {
    log.error(e);
  }
})();
