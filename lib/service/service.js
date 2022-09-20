const path = require("path");
const fs = require("fs");
const log = require("../utils/log.js");
const { getConfigFile, loadModule } = require("../utils/index");
const constant = require("./const");
const WebpackChain = require("webpack-chain");
const HOOK_KEYS = [constant.HOOK_START, constant.HOOK_PLUGIN];

class Service {
  constructor(opts) {
    this.args = opts; // 创建args对象 包含所有参数
    this.config = {}; // 创建config对象 包含所有的config配置信息
    this.hooks = {};
    this.plugins = [];
    this.dir = process.cwd();
    this.webpackConfig = {};
    this.internalValue = {};
    this.log = log;
    this.webpack = {};
    log.verbose("service实例化", opts);
  }

  start = async () => {
    log.verbose("service 执行方法: start");
    await this.resolveConfig();
    await this.registerHooks();
    await this.emitHooks(constant.HOOK_START);
    await this.registerPlugin();
    await this.runPlugin();
    await this.initWebpack();
  };

  initWebpack = async () => {
    let { customWebpackPath } = this.args;
    if (customWebpackPath) {
      if (fs.existsSync(customWebpackPath)) {
        if (!path.isAbsolute(customWebpackPath)) {
          customWebpackPath = path.resolve(customWebpackPath);
        }
        this.webpack = require.resolve(customWebpackPath);
      }
    } else {
      this.webpack = require.resolve("webpack", {
        paths: [path.resolve(process.cwd(), "node_modules")]
      });
    }
  };

  resolveConfig = async () => {
    // 解析配置文件
    const { config } = this.args;
    log.verbose("service 执行方法：resolveConfig（解析配置文件）", config);
    let configFilePath = "";
    if (config) {
      configFilePath = path.isAbsolute(config) ? config : path.resolve(config);
    } else {
      configFilePath = getConfigFile({ cwd: this.dir });
    }
    log.verbose("配置文件解析configFilePath:", configFilePath);

    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = await loadModule(configFilePath);
      log.verbose("配置文件解析完成，文件存在", this.config);
    } else {
      log.error("配置文件解析完成，文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
    this.webpackConfig = new WebpackChain();
  };

  registerHooks = async () => {
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
  };

  emitHooks = async (key) => {
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
  };

  async registerPlugin() {
    log.verbose("开始插件注册");
    let { plugins } = this.config;
    if (plugins) {
      if (typeof plugins === "function") {
        plugins = plugins.call(this);
      }
      if (Array.isArray(plugins)) {
        for (let plugin of plugins) {
          if (typeof plugin === "string") {
            const mod = await loadModule(plugin);
            this.plugins.push({ mod });
          } else if (Array.isArray(plugin)) {
            const [pluginPath, pluginParams] = plugin;
            const mod = await loadModule(pluginPath);
            this.plugins.push({ mod, params: pluginParams });
          } else if (typeof plugin === "function") {
            this.plugins.push({
              mod: plugin
            });
          }
        }
      }
    }
    log.verbose("结束插件注册", this.plugins);
  }

  runPlugin = async () => {
    log.verbose("运行插件");
    for (let plugin of this.plugins) {
      const { mod, params } = plugin;
      if (!mod) {
        continue;
      }

      const API = {
        getConfigWebpack: this.getConfigWebpack,
        emitHooks: this.emitHooks,
        getValue: this.getValue,
        setValue: this.setValue,
        log
      };

      const options = {
        ...params
      };

      await mod(API, options);
    }
  };

  getConfigWebpack = () => {
    return this.webpackConfig;
  };

  setValue = (key, value) => {
    this.internalValue[key] = value;
  };

  getValue = (key) => {
    return this.internalValue[key];
  };
}

module.exports = Service;
