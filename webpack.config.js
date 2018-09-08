var path = require('path')
var webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/index.html',
      './src/res/index.less'
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
      { // js代码语法检查
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.jsx?$/,
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
      {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css')
  ],
  devtool: 'inline-source-map',
}