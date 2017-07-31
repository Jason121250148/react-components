var path = require('path')
var webpack = require('webpack')

// function resolve(dir) {
//   return path.join(__dirname, '..', dir)
// }

module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/index.html',
      // 'react-hot-loader/patch',
      // 'webpack-dev-server/client',
      // 'webpack/hot/only-dev-server',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // include: [resolve('src')],
        // exclude: [resolve('node_modules')],
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: [
          'file-loader?name=[name].html',
          'extract-loader',
          'html-loader'
        ]
      },
    ],
  },
  devtool: 'inline-source-map',
  // plugins: [
  // new webpack.HotModuleReplacementPlugin(),
  // new webpack.NamedModulesPlugin(),
  // ],
}