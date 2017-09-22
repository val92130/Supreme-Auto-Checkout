const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extConfig = {
  entry: [
    './src/extension/content/index.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'extension.js',
    publicPath: '/',
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
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-runtime',
          ],
        },
      },
    ],
  },
};

const backgroundConfig = {
  entry: [
    './src/extension/background/index.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'background.js',
    publicPath: '/',
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
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-runtime',
          ],
        },
      },
    ],
  },
};

const optionsConfig = {
  devtool: '#eval-source-map',
  entry: [
    './src/app/index.jsx',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './src/',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Supreme Auto Checkout',
      template: __dirname + '/src/app/index.hbs',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
            { from: './src/assets/', to: 'assets' },
            { from: './manifest.json', to: './manifest.json' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
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
          env: {
            development: {
              presets: ['react-hmre'],
              plugins: [
                ['react-transform', {
                  transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module'],
                  }],
                }],
              ],
            },
          },
        },
      },
      { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: 'file' },
    ],
  },
};

module.exports = [optionsConfig, extConfig, backgroundConfig];
