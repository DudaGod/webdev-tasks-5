'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProd = (() => process.env.NODE_ENV === 'production')();

module.exports = {
    context: path.join(__dirname, 'server/bundles'),
    entry: [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './index/index.js'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        /*preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                exclude: /node_modules/
            }
        ],*/
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|jpg|svg)/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('bundle.css'),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify('production')
        })
    ],
    postcss: () => {
        let postPlugins = [autoprefixer];
        return isProd ? postPlugins.concat(cssnano) : postPlugins;
    }
};

if (isProd) {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}
