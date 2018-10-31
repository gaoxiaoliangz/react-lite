const path = require('path')

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
