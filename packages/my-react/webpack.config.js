const path = require('path')

module.exports = {
  entry: {
    react: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  mode: 'development',
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        loader: require.resolve('babel-loader'),
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
  },
}
