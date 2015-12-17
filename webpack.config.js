var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

module.exports = {
  watch: true,
  entry: {
    bbs: './src/asset/js/bbs/index.js',
    'bbs-comment': './src/asset/js/bbs/feedback/comment/add.js',
    'bbs-post': './src/asset/js/bbs/post/add.js',
    'bbs-detail': './src/asset/js/bbs/detail.js',
    'bbs-about-me': './src/asset/js/bbs/about-me/index.js',
    login: './src/asset/js/login/index.js',
    register: './src/asset/js/register/index.js',
    retrieve: './src/asset/js/retrieve/index.js',
    dev: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server']
  },
  output: {
    path: path.resolve(__dirname, pkg.dest),
    publicPath: '',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    alias: {
      zepto: path.resolve(__dirname, './node_modules/zepto/dist/zepto.js')
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('dev', 'dev.bundle.js'),
    new webpack.optimize.CommonsChunkPlugin('zepto', 'zepto.bundle.js'),
    new webpack.ProvidePlugin({
      $: 'zepto',
      zepto: 'zepto',
      'window.zepto': 'zepto',
      'root.zepto': 'zepto'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      title: '社区',
      template: './src/page/index.html',
      filename: 'bbs.html',
      chunks: ['bbs', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发帖',
      template: './src/page/index.html',
      filename: 'bbs-post.html',
      chunks: ['bbs-post', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '帖子详情',
      template: './src/page/index.html',
      filename: 'bbs-detail.html',
      chunks: ['bbs-detail', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '评论',
      template: './src/page/index.html',
      filename: 'bbs-comment.html',
      chunks: ['bbs-comment', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '与我有关',
      template: './src/page/index.html',
      filename: 'bbs-about-me.html',
      chunks: ['bbs-about-me', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '登录',
      template: './src/page/index.html',
      filename: 'login.html',
      chunks: ['login', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '注册',
      template: './src/page/index.html',
      filename: 'register.html',
      chunks: ['register', 'zepto', 'dev'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找回密码',
      template: './src/page/index.html',
      filename: 'retrieve.html',
      chunks: ['retrieve', 'zepto', 'dev'],
      inject: 'body'
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
    }, {
      test: /zepto(\.min)?\.js$/,
      loader: "exports?Zepto; delete window.$; delete window.Zepto;"
    }]
  },
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({ advanced: true, keepSpecialComments: false }),
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
        secure: false
      },
      '/mvc/code_msg*': {
        target: 'http://api.ttyhuo.com:83',
        secure: false
      },
      '/mvc*': {
        target: 'http://ttyhuo.com',
        secure: false
      }
    }
  }
};
