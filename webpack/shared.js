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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '..', 'src'),
    },
    extensions: ['.ts', '.tsx'],
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
