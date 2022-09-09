const semver = require("semver");

module.exports = function checkNode(expression) {
  // 获取当前node版本号
  const nodeVersion = semver.valid(semver.coerce(process.version));
  return semver.satisfies(nodeVersion, expression);
};
