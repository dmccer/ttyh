var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/');
var pkg = require('./package.json');

function createPage(title, pageName) {
  return new HtmlWebpackPlugin({
    title: title,
    template: './src/page/index.ejs',
    filename: pageName + '.html',
    chunks: [pageName, 'fetch'],
    chunksSortMode: 'dependency',
    inject: 'body'
  });
}

module.exports = {
  entry: {
    bbs: './src/asset/js/bbs/index.js',
    'bbs-comment': './src/asset/js/bbs/feedback/comment/add.js',
    'bbs-post': './src/asset/js/bbs/post/add.js',
    'bbs-detail': './src/asset/js/bbs/detail.js',
    'bbs-about-me': './src/asset/js/bbs/about-me/index.js',
    login: './src/asset/js/login/index.js',

    term: './src/asset/js/term/index.js',
    'topic-posts': './src/asset/js/bbs/post/list-topic.js',
    'user-posts': './src/asset/js/bbs/post/list-user.js',
    'active-users': './src/asset/js/bbs/active-user/list.js',
    'notice': './src/asset/js/bbs/notice/index.js',

    'pkg-pub': './src/asset/js/pkg/pub/index.js',
    'truck-requirement': './src/asset/js/pkg/pub/truck-requirement/index.js',
    'pkg-pub-memo': './src/asset/js/pkg/pub/memo/index.js',
    'my-pkg': './src/asset/js/pkg/my/index.js',

    'pkg-search': './src/asset/js/pkg/search/index.js',
    'today-pkg': './src/asset/js/pkg/today-list/',
    'pkg-detail': './src/asset/js/pkg/detail/index.js',
    'pkg-info-pub': './src/asset/js/pkg/pub/info/index.js',
    'sp-pkg-search': './src/asset/js/pkg/sp-pkg-search/index.js',

    'truck-pub': './src/asset/js/truck/pub/index.js',
    'roadtrain': './src/asset/js/truck/roadtrain/index.js',
    'my-roadtrain': './src/asset/js/truck/my-roadtrain/index.js',
    'truck-add': './src/asset/js/truck/add/index.js',
    'select-truck-common-route': './src/asset/js/truck/add/route/index.js',
    'my-truck': './src/asset/js/truck/my/index.js',

    'truck-search': './src/asset/js/truck/search/index.js',
    'sp-truck-search': './src/asset/js/truck/sp-truck-search/index.js',
    'truck-detail': './src/asset/js/truck/detail/index.js',
    'today-truck': './src/asset/js/truck/today-list/',
    'sp-route': './src/asset/js/truck/sp-route/',
    'sp-com': './src/asset/js/sp-com/',

    'real-name-certify': './src/asset/js/account/real-name-certify/index.js',
    'trucker-certify': './src/asset/js/account/trucker-certify/index.js',
    'company-certify': './src/asset/js/account/company-certify/index.js',
    'company-certify-result': './src/asset/js/account/company-certify/result/index.js',
    'real-name-certify-result': './src/asset/js/account/real-name-certify/result/index.js',
    'trucker-certify-result': './src/asset/js/account/trucker-certify/result/index.js',

    report: './src/asset/js/report/index.js',

    clear: './src/asset/js/clear/index.js'
  },

  plugins: [
    // start 社区
    createPage('社区', 'bbs'),
    createPage('评论', 'bbs-comment'),
    createPage('发帖', 'bbs-post'),
    createPage('详情', 'bbs-detail'),
    createPage('与我有关', 'bbs-about-me'),
    createPage('服务条款', 'term'),
    createPage('热门帖子', 'topic-posts'),
    createPage('用户帖子', 'user-posts'),
    createPage('人气用户', 'active-users'),
    createPage('小妹公告', 'notice'),
    // end 社区

    createPage('登录', 'login'),
    createPage('举报', 'report'),

    // start 货主
    createPage('找车', 'truck-search'),
    createPage('发布货源', 'pkg-pub'),
    createPage('用车需求', 'truck-requirement'),
    createPage('货源信息', 'pkg-info-pub'),
    createPage('发布货源-备注', 'pkg-pub-memo'),
    createPage('货源详情', 'pkg-detail'),
    createPage('我的货源', 'my-pkg'),
    createPage('推荐货源', 'today-pkg'),
    createPage('专线查询', 'sp-route'),
    createPage('', 'sp-truck-search'),
    // end 货主

    // start 车主
    createPage('找货', 'pkg-search'),
    createPage('发布车源', 'truck-pub'),
    createPage('我的车队', 'roadtrain'),
    createPage('我的车队', 'my-roadtrain'),
    createPage('添加车辆', 'truck-add'),
    createPage('常跑路线', 'select-truck-common-route'),
    createPage('车源详情', 'truck-detail'),
    createPage('我的车源', 'my-truck'),
    createPage('推荐车源', 'today-truck'),
    createPage('', 'sp-pkg-search'),
    createPage('专线公司详情', 'sp-com'),
    // end 车主

    // start 认证
    createPage('实名认证', 'real-name-certify'),
    createPage('司机认证', 'trucker-certify'),
    createPage('公司认证', 'company-certify'),
    createPage('实名认证结果', 'real-name-certify-result'),
    createPage('公司认证结果', 'company-certify-result'),
    createPage('司机认证结果', 'trucker-certify-result'),
    // end 认证

    createPage('清除数据', 'clear'),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  watch: true,
  output: {
    path: path.resolve(__dirname, pkg.dest),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/index.js'),
      fetch: path.resolve(__dirname, './node_modules/whatwg-fetch/')
    }
  },
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
        'img?minimize'
      ]
    }, {
      test: /\.(html|htm)$/,
      loader: 'html-loader'
    }, {
      test: /\.(woff|eot)(#[a-zA-Z])*$/,
      loader: 'file-loader'
    }, {
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: [
        'react-hot',
        'babel-loader'
      ]
    }]
  },
  imagemin: {
    gifsicle: { interlaced: false },
    jpegtran: {
      progressive: true,
      arithmetic: false
    },
    optipng: { optimizationLevel: 5 },
    pngquant: {
      floyd: 0.5,
      speed: 2
    },
    svgo: {
      plugins: [
        { removeTitle: true },
        { convertPathData: false }
      ]
    }
  },
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({ advanced: true, keepSpecialComments: false }),
      new LessPluginAutoPrefix({ browsers: ['last 3 versions', 'Android 4'] })
    ]
  }
};
