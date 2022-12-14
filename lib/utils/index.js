const fg = require("fast-glob");
const fs = require("fs");
const DEFAULT_CONFIG_NAME = ["jw-build-config.(mjs|js|json)"];
const path = require("path");
const log = require("./log");

/**
 * 模块加载
 * 1. 相对路径
 * 2. 绝对路径
 * 3. node_modules路径
 * 模块结构支持 ESModule or CommonJs Module
 * @param {} modulePath
 * @returns
 */
const loadModule = async (modulePath) => {
  log.verbose("loadModule模块加载", modulePath);

  if (modulePath.startsWith("/") || modulePath.startsWith(".")) {
    if (!path.isAbsolute(modulePath)) {
      modulePath = path.resolve(modulePath);
    }
    modulePath = require.resolve(modulePath);
  } else {
    modulePath = require.resolve(modulePath, {
      paths: [path.resolve(process.cwd(), "node_modules")]
    });
  }

  if (modulePath && fs.existsSync(modulePath)) {
    let result;
    const isMjs = modulePath.endsWith(".mjs");
    if (isMjs) {
      result = (await import(modulePath)).default;
    } else {
      result = require(modulePath);
    }
    return result;
  }

  return null;
};

const getConfigFile = ({ cwd = process.cwd() } = {}) => {
  const [configFile] = fg.sync(DEFAULT_CONFIG_NAME, {
    cwd,
    absolute: true
  });

  return configFile;
};

const checkDebug = () => {
  if (process.argv.indexOf("--debug") >= 0 || process.argv.indexOf("-d") >= 0) {
    process.env.LOG_LEVEL = "verbose";
    log.level = process.env.LOG_LEVEL;
  } else {
    process.env.LOG_LEVEL = "info";
    log.level = process.env.LOG_LEVEL;
  }
};

module.exports = {
  getConfigFile,
  checkDebug,
  loadModule
};
