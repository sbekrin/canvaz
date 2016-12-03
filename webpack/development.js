import merge from 'webpack-merge';
import sharedConfig from './shared';

export default merge(sharedConfig, {
    devtool: '#inline-source-map',
    debug: true
});
