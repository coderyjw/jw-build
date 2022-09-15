#!/usr/bin/env node

const { checkDebug } = require('../lib/utils/index');
checkDebug();

const { program } = require('commander');
const checkNode = require('../lib/checkNode');
const pkg = require('../package.json');
const startServer = require('../lib/start/startServer');
const buildServer = require('../lib/build/build');
const MIN_NODE_VERSION = '8.9.0';

(async () => {
  try {
    /* 检查node版本号 */
    if (!checkNode('>=' + MIN_NODE_VERSION)) {
      throw new Error('Please upgrade your node version to v') + MIN_NODE_VERSION;
    }

    program.version(pkg.version);

    /* 注册start命令 */
    program
      .command('start')
      .option('-c, --config <config>', '配置文件路径')
      .description('start service by jw-build')
      .allowUnknownOption()
      .action(startServer);

    /* 注册build命令 */
    program
      .command('build')
      .option('-c, --config <config>', '配置文件路径')
      .description('build service by jw-build')
      .allowUnknownOption()
      .action(buildServer);

    program.option('-d, --debug', '开启调试模式').hook('preAction', (thisCommand, actionCommand) => {
      const { debug = false } = actionCommand.optsWithGlobals();
      if (debug) {
        process.env.LOG_LEVEL = 'verbose';
      } else {
        process.env.LOG_LEVEL = 'info';
      }
    });

    /* 命令解析  */
    program.parse(process.argv);
  } catch (e) {
    log.error(e);
  }
})();
