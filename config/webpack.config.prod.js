const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');
const cssLoaders = require('./cssLoaders');

let config = {};

config.devtool = 'source-map';

config.entry = ['babel-polyfill', paths.app.srcIndex];

config.output = {
  path: paths.app.build,
  publicPath: paths.publicPath,
  filename: '[name].[chunkhash].js',
};

config.resolve = {
  modules: [paths.app.src, paths.nodeModules, 'node_modules'],
  extensions: ['.js', '.json'],
};

config.module = {
  rules: [
    {
      test: /\.(js|jsx)?$/,
      enforce: 'pre',
      use: 'eslint-loader',
      include: paths.app.src,
    },
    {
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
      include: paths.app.src,
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoaders,
      }),
    },
  ],
};

config.plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.app.srcHtml,
  }),
  new ExtractTextPlugin({
    filename: 'styles.[chunkhash].css',
    allChunks: true,
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new webpack.optimize.CommonsChunkPlugin({name: 'common'}),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: true,
    },
    minimize: true,
    sourceMap: true,
  }),
];

module.exports = config;
