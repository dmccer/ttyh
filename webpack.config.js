var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server',
module.exports = {
  entry: {
    bbs: './src/asset/js/bbs/index.js',
    'bbs-comment': './src/asset/js/bbs/feedback/comment/add.js',
    'bbs-post': './src/asset/js/bbs/post/add.js',
    'bbs-detail': './src/asset/js/bbs/detail.js',
    'about-me': './src/asset/js/bbs/about-me/index.js',
    login: './src/asset/js/login/index.js',
    register: './src/asset/js/register/index.js',
    vendor: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server', './bower_components/zepto/zepto.js']
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    publicPath: 'dist/js',
    filename: '[name].bundle.js',
    chunkFilename: "[id].chunk.js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'source-map'
    }],
    loaders: [{
      test: /\.less$/,
      loaders: [
        'style',
        'css',
        'less'
      ]
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css'
      ]
    }, {
      test: /\.(png|jpg|gif|svg|ttf)(#[a-zA-Z])*$/,
      loaders: [
        'url?limit=8192',
        'img'
      ]
    }, {
      test: /\.(html|htm)$/,
      loader: 'html-loader'
    }, {
      test: /\.(woff|eot)(#[a-zA-Z])*$/,
      loader: 'file-loader'
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: [
        'react-hot',
        'babel?presets[]=react,presets[]=es2015'
      ]
    }]
  },
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({advanced: true, keepSpecialComments: false}),
      new LessPluginAutoPrefix({ browsers: ['last 3 versions', 'Android 4'] })
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    inline: true,
    proxy: {
      '/mvc/bbs*': {
        target: 'http://api.ttyhuo.com:83',
        // target: 'http://o.dp:3000',
        secure: false
      },
      '/mvc/code_msg*': {
        target: 'http://api.ttyhuo.com:83',
        // target: 'http://o.dp:3000',
        secure: false
      },
      '/mvc*': {
        target: 'http://ttyhuo.com',
        secure: false
      }
    }
  }
};
