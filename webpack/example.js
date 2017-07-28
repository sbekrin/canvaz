const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: '#inline-source-map',
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, '..', 'example'),
    noInfo: true,
    stats: {
      colors: true,
    },
  },
  entry: './example/index.tsx',
  output: {
    path: resolve(__dirname, '..', 'example'),
    filename: 'bundle.js',
    publicPath: '/',
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
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
      url: {
        dataUrlLimit: Infinity,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
