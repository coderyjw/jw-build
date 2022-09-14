const path = require("path");
const fs = require("fs");
const log = require("../utils/log.js");
const { getConfigFile } = require("../utils/index");

class Service {
  constructor(opts) {
    this.args = opts; // 创建args对象 包含所有参数
    this.config = {}; // 创建config对象 包含所有的config配置信息
    this.hooks = {};
    this.dir = process.cwd();
  }

  async start() {
    this.resolveConfig();
  }

  resolveConfig() {
    // 解析配置文件

    const { config } = this.args;
    let configFilePath = "";
    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
    } else {
      configFilePath = getConfigFile(this.dir);
    }

    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = require(configFilePath);
      log.verbose("配置文件存在", this.config);
    } else {
      log.error("配置文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
  }
}

module.exports = Service;
