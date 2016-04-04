var path = require('path')
var webpack = require('webpack')
var PACKAGE = require('./package.json')

var banner = PACKAGE.name + " - v" + PACKAGE.version + " - " + new Date().toISOString()

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    'input': './input',
    'codemirror3': ['./codemirror3'],
    'codemirror4': './codemirror',
    'codemirror5': './codemirror',
    'angularjs': './angular',
    'jquery': './jquery'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].inline-attachment.js',
    library: 'InlineAttachment',
    libraryTarget: 'var'
  },
  externals: {
    'angular': 'angular',
    'jquery': 'jQuery'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
//    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(banner)
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel', 'strip-loader?strip[]=console.log'],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}
