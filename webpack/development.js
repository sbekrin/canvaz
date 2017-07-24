const merge = require('webpack-merge');
const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  devtool: '#inline-source-map',
  debug: true,
});
