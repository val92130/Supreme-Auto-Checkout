const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/app/index.hbs',
  filename: 'index.html',
  inject: 'body'
});

const CopyWebPackPluginConfig = new CopyWebpackPlugin([
    { from: './src/assets/', to: 'assets' },
    { from: './manifest.json', to: './manifest.json' }
]);

module.exports = {
  entry: './src/app/index.jsx',
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      request: 'browser-request',
    },
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-runtime',
          ],
        },
      },
      { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: 'file' },
    ],
  },
  plugins: [HtmlWebpackPluginConfig, CopyWebPackPluginConfig]
};
