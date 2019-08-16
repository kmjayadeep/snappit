const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader'],
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: './client/assets', to: 'assets' },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
};
