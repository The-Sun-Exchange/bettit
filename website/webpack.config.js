const path = require("path");

module.exports = {
  node: {
    fs: "empty",
    net: "empty"
  },
  entry: "./ws.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "bundle.js"
  }
};
