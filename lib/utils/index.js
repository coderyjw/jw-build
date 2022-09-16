const fg = require("fast-glob");
const fs = require("fs");
const DEFAULT_CONFIG_NAME = ["jw-build-config.(mjs|js|json)"];
const path = require("path");

const loadModule = async (modulePath) => {
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
  } else {
    process.env.LOG_LEVEL = "info";
  }
};

module.exports = {
  getConfigFile,
  checkDebug,
  loadModule
};
