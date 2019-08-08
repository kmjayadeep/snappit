const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: './client/src/assets', to: 'assets' },
    ]),
  ],
};
