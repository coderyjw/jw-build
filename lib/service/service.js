const path = require("path");
const fs = require("fs");
const log = require("../utils/log.js");
const { getConfigFile, loadModule } = require("../utils/index");
const constant = require("./const");

const HOOK_KEYS = [constant.HOOK_START];
class Service {
  constructor(opts) {
    this.args = opts; // 创建args对象 包含所有参数
    this.config = {}; // 创建config对象 包含所有的config配置信息
    this.hooks = {};
    this.dir = process.cwd();
    log.verbose('service实例化', this)
  }

  async start() {
    log.verbose('service start方法', this)
    await this.resolveConfig();
    await this.registerHooks();
    await this.emitHooks(constant.HOOK_START);
  }

  async resolveConfig() {
    // 解析配置文件
    log.verbose("开始解析配置文件");
    const { config } = this.args;
    let configFilePath = "";
    if (config) {
      configFilePath = path.isAbsolute(config) ? config : path.resolve(config);
    } else {
      configFilePath = getConfigFile(this.dir);
    }

    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = await loadModule(configFilePath);
      log.verbose("配置文件解析完成，文件存在", this.config);
    } else {
      log.error("配置文件解析完成，文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
  }

  async registerHooks() {
    const { hooks } = this.config;
    log.verbose("开始注册hooks", hooks);
    if (hooks && hooks.length > 0) {
      for (let hook of hooks) {
        const [key, fn] = hook;
        if (key && fn && HOOK_KEYS.includes(key) && typeof key === "string") {
          this.hooks[key] ? "" : (this.hooks[key] = []);
          if (typeof fn === "function") {
            this.hooks[key].push(fn);
          } else if (typeof fn === "string") {
            const newFn = await loadModule(fn);
            newFn && this.hooks[key].push(newFn);
          }
        }
      }
    }
    log.verbose("hooks注册完成", this.hooks);
  }

  async emitHooks(key) {
    const hooks = this.hooks[key];
    if (hooks) {
      for (let fn of hooks) {
        try {
          log.verbose(`执行hook: ${key}`);
          await fn(this);
        } catch (err) {
          log.error(err);
        }
      }
    }
  }
}

module.exports = Service;
