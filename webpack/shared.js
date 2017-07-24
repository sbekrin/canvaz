const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: resolve(__dirname, '..', 'src', 'index.js'),
  output: {
    path: resolve(__dirname, '..', 'dist'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      { test: /\.svg$/, loader: 'svg-url-loader' },
    ],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '..', 'src'),
    },
    extensions: ['.js'],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      url: {
        dataUrlLimit: Infinity,
      },
    }),
  ],
};
