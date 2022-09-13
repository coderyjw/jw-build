const path = require("path");
const DEFAULT_CONFIG_NAME = "jw-config";
class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
  }

  async start() {
    this.resolveConfig();
  }

  resolveConfig() {
    const { config } = this.args;
    let configFilePath = "";
    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
    }
    console.log("解析配置文件", configFilePath);
  }
}

module.exports = Service;
