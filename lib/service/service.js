const path = require("path");
const fs = require("fs");
const log = require("../utils/log.js");
const { getConfigFile } = require("../utils/index");
const constant = require("./const");

const HOOK_KEYS = [constant.HOOK_START];
class Service {
  constructor(opts) {
    this.args = opts; // 创建args对象 包含所有参数
    this.config = {}; // 创建config对象 包含所有的config配置信息
    this.hooks = {};
    this.dir = process.cwd();
  }

  async start() {
    await this.resolveConfig();
    this.registerHooks();
    this.emitHooks(constant.HOOK_START);
  }

  async resolveConfig() {
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
      const isMjs = configFilePath.endsWith(".mjs");
      if (isMjs) {
        this.config = (await import(configFilePath)).default;
      } else {
        this.config = require(configFilePath);
      }
      console.log(this.config);
      log.verbose("配置文件存在", this.config);
    } else {
      log.error("配置文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
  }

  registerHooks() {
    const { hooks } = this.config;
    if (hooks && hooks.length > 0) {
      hooks.forEach((hook) => {
        const [key, fn] = hook;
        if (key && fn && HOOK_KEYS.includes(key)) {
          if (typeof key === "string" && typeof fn === "function") {
            const existHook = this.hooks[key];
            if (!existHook) {
              this.hooks[key] = [];
            }
            this.hooks[key].push(fn);
          }
        }
      });
    }
    log.verbose("hooks", this.hooks);
  }

  async emitHooks(key) {
    const hooks = this.hooks[key];
    if (hooks) {
      for (let fn of hooks) {
        try {
          await fn(this);
        } catch (err) {
          log.error(err);
        }
      }
    }
  }
}

module.exports = Service;
