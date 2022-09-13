const fg = require("fast-glob");
const DEFAULT_CONFIG_NAME = ["jw-build-config.(mjs|js|json)"];

const getConfigFile = ({ cwd = process.cwd() } = {}) => {
  const [configFile] = fg.sync(DEFAULT_CONFIG_NAME, {
    cwd,
    absolute: true,
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
};
