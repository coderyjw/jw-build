const path = require("path");
const fg = require("fast-glob");
const fs = require("fs");
const log = require("../utils/log.js");

const DEFAULT_CONFIG_NAME = ["jw-build-config.(mjs|js|json)"];
class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.dir = process.cwd();
  }

  async start() {
    this.resolveConfig();
  }

  resolveConfig() {
    log.verbose("解析配置文件");
    const { config } = this.args;
    let configFilePath = "";
    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
    } else {
      const [configFile] = fg.sync(DEFAULT_CONFIG_NAME, {
        cwd: this.dir,
        absolute: true,
      });
      configFilePath = configFile;
    }
    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = require(configFilePath);
      log.verbose("配置文件存在", configFilePath, this.config);
    } else {
      log.error("配置文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
  }
}

module.exports = Service;
