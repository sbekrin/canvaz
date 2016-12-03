import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack/example';

const app = express();
const compiler = webpack(config);

app.use(express.static(__dirname));

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
}));

app.use(webpackHotMiddleware(compiler));

app.listen(3001);
