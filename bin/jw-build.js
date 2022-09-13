#!/usr/bin/env node

const { program } = require("commander");
const checkNode = require("../lib/checkNode");
const pkg = require("../package.json");
const startServer = require("../lib/start/startServer");
const buildServer = require("../lib/build/build");
const MIN_NODE_VERSION = "8.9.0";

(async () => {
  try {
    if (!checkNode(">=" + MIN_NODE_VERSION)) {
      throw (
        new Error("Please upgrade your node version to v") + MIN_NODE_VERSION
      );
    }

    program.version(pkg.version);

    program
      .command("start")
      .option("-c, --config <config>", "配置文件路径")
      .description("start service by jw-build")
      .allowUnknownOption()
      .action(startServer);

    program
      .command("build")
      .option("-c, --config <config>", "配置文件路径")
      .description("build service by jw-build")
      .allowUnknownOption()
      .action(buildServer);

    program.parse(process.argv);
  } catch (e) {
    console.log(e);
  }
})();
