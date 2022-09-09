#!/usr/bin/env node
const checkNode = require("../lib/checkNode");
const pkg = require("../package.json");

const MIN_NODE_VERSION = "8.9.0";
(async () => {
  try {
    if (!checkNode(">=" + MIN_NODE_VERSION)) {
      throw (
        new Error("Please upgrade your node version to v") + MIN_NODE_VERSION
      );
    }
  } catch (e) {
    console.log(e);
  }
})();
