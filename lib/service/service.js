const DEFAULT_CONFIG_NAME = 'jw-config'
class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
  }

  async start() {
    this.resolveConfig()
  }

  resolveConfig() {

  }
}

module.exports = Service;
