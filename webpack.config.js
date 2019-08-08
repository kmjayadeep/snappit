const path = require('path');

module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
};
