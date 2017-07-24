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
  entry: './example/index.js',
  output: {
    path: resolve(__dirname, '..', 'example'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      { test: /\.svg$/, loader: 'svg-url-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '..', 'src'),
    },
    extensions: ['.js'],
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
