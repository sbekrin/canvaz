const webpack = require('webpack');
const merge = require('webpack-merge');
const sharedConfig = require('./shared');
const { name: packageName } = require('../package.json');

const target = process.env.TARGET || 'umd_prod';

module.exports = merge(sharedConfig, {
  output: {
    filename: {
      es: `${packageName}.es.js`,
      umd_dev: `${packageName}.js`,
      umd_prod: `${packageName}.min.js`,
    }[target],
    library: {
      root: 'Canvaz',
      umd: packageName,
      commonjs: packageName,
    },
    libraryTarget: target === 'es' ? 'commonjs-module' : 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    target === 'umd_prod' &&
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        sourceMap: false,
      }),
  ].filter(Boolean),
});
