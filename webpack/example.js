import path from 'path';
import webpack from 'webpack';

export default {
    debug: true,
    devtool: '#inline-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './example/index.js'
    ],
    output: {
        path: path.resolve(__dirname, '..', 'example'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    url: {
        dataUrlLimit: Infinity
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel?cacheDirectory' },
            { test: /\.svg$/, loader: 'svg-url' },
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    resolve: {
        root: [
            path.resolve(__dirname, '..', 'src'),
            path.resolve(__dirname, '..', 'node_modules')
        ],
        extensions: [ '', '.js' ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
