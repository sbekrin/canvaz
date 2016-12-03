import path from 'path';
import { name as libraryName } from '../package.json';

export default {
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, '..', 'lib'),
        filename: 'index.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    url: {
        dataUrlLimit: Infinity
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel?cacheDirectory' },
            { test: /\.svg$/, loader: 'svg-url' }
        ]
    },
    resolve: {
        root: [
            path.resolve(__dirname, '..', 'src'),
            path.resolve(__dirname, '..', 'node_modules')
        ],
        extensions: [ '', '.js' ]
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'React',
            root: 'React'
        }
    },
    plugins: []
};
