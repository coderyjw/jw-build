const path = require("path");
const fs = require("fs");
const log = require("../utils/log.js");
const webpack = require("webpack");
const { getConfigFile, loadModule } = require("../utils/index");
const constant = require("./const");
const WebpackChain = require("webpack-chain");
const HOOK_KEYS = [constant.HOOK_START, constant.HOOK_PLUGIN];
const InitPlugin = require("../../plugins/initPlugins");
class Service {
  constructor(opts) {
    log.verbose("======执行 service constructor 函数======");
    log.verbose("构造函数参数", opts);
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.plugins = [];
    this.dir = process.cwd();
    this.webpackConfig = {};
    this.internalValue = {};
    this.log = log;
    this.webpack = {};
    log.verbose("======结束 service constructor 函数======");
  }

  start = async () => {
    log.verbose("======执行 service start 函数======");
    await this.resolveConfig();
    await this.registerHooks();
    await this.emitHooks(constant.HOOK_START);
    await this.registerPlugin();
    await this.runPlugin();
    await this.initWebpack();
    await this.startServer();
    log.verbose("======结束 service start 函数======");
    // log.verbose("webpack config", this.webpackConfig.toConfig());
    // log.verbose("webpack loader", this.webpackConfig.toConfig().module.rules);
  };

  startServer = async () => {
    log.verbose("======执行 service startServer 函数======");
    let compiler;
    try {
      const webpack = require(this.webpack);
      const webpackConfig = this.webpackConfig.toConfig();
      log.verbose("webpackConfig", webpackConfig);
      compiler = webpack(webpackConfig, (err, stats) => {
        console.log({ err, stats });
      });
    } catch (err) {
      log.error("startServer", err);
    }
    log.verbose("======结束 service startServer 函数======");
  };

  initWebpack = async () => {
    log.verbose("======执行 service initWebpack 函数======");
    let { customWebpackPath } = this.args;
    if (customWebpackPath) {
      if (fs.existsSync(customWebpackPath)) {
        if (!path.isAbsolute(customWebpackPath)) {
          customWebpackPath = path.resolve(customWebpackPath);
        }
        log.verbose("customWebpackPath", customWebpackPath);
        this.webpack = require.resolve(customWebpackPath);
      }
    } else {
      customWebpackPath = path.resolve(process.cwd(), "node_modules");

      this.webpack = require.resolve("webpack", {
        paths: [customWebpackPath],
      });
    }
    log.verbose("this.webpack", this.webpack);
    log.verbose("======结束 service initWebpack 函数======");
  };

  resolveConfig = async () => {
    log.verbose("======执行 service resolveConfig 函数======");
    log.verbose("解析配置文件");

    const { config } = this.args;
    let configFilePath = "";
    if (config) {
      configFilePath = path.isAbsolute(config) ? config : path.resolve(config);
    } else {
      configFilePath = getConfigFile({ cwd: this.dir });
    }

    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = await loadModule(configFilePath);
      log.verbose("配置文件解析完成，文件存在", this.config);
    } else {
      log.error("配置文件解析完成，文件不存在，中止执行", configFilePath);
      process.exit(1);
    }
    this.webpackConfig = new WebpackChain();
    log.verbose("======结束 service resolveConfig 函数======");
  };

  registerHooks = async () => {
    log.verbose("======执行 service registerHooks 函数======");
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
    log.verbose("======结束 service registerHooks 函数======");
  };

  emitHooks = async (key) => {
    log.verbose("======执行 service emitHooks 函数======");
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
    log.verbose("======结束 service emitHooks 函数======");
  };

  async registerPlugin() {
    log.verbose("======执行 service registerPlugin 函数======");
    let { plugins } = this.config;
    const builtInPlugins = [InitPlugin];
    builtInPlugins.forEach((plugin) => {
      this.plugins.push({
        mod: plugin,
      });
    });
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
              mod: plugin,
            });
          }
          log.verbose("注册插件", plugin);
        }
      }
    }
    log.verbose("======结束 service registerPlugin 函数======");
  }

  runPlugin = async () => {
    log.verbose("======执行 service runPlugin 函数======");
    for (let plugin of this.plugins) {
      const { mod, params } = plugin;
      if (!mod) {
        continue;
      }

      const API = {
        getWebpackConfig: this.getWebpackConfig,
        emitHooks: this.emitHooks,
        getValue: this.getValue,
        setValue: this.setValue,
        log,
      };

      const options = {
        ...params,
      };

      log.verbose("执行插件", plugin);
      await mod(API, options);
    }
    log.verbose("======结束 service runPlugin 函数======");
  };

  getWebpackConfig = () => {
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
