var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/');

var pkg = require('./package.json');

module.exports = {
  debug: true,
  watch: true,
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

    'truck-pub': './src/asset/js/truck/pub/index.js',
    'roadtrain': './src/asset/js/truck/roadtrain/index.js',
    'my-roadtrain': './src/asset/js/truck/my-roadtrain/index.js',
    'truck-add': './src/asset/js/truck/add/index.js',
    'select-truck-common-route': './src/asset/js/truck/add/route/index.js',
    'my-truck': './src/asset/js/truck/my/index.js',

    'truck-search': './src/asset/js/truck/search/index.js',
    'search-filter': './src/asset/js/truck/filter/index.js',
    'truck-detail': './src/asset/js/truck/detail/index.js',
    'today-truck': './src/asset/js/truck/today-list/',

    'real-name-certify': './src/asset/js/account/real-name-certify/index.js',
    'trucker-certify': './src/asset/js/account/trucker-certify/index.js',
    'company-certify': './src/asset/js/account/company-certify/index.js',
    'company-certify-result': './src/asset/js/account/company-certify/result/index.js',
    'company-certify-result': './src/asset/js/account/company-certify/result/index.js',
    'real-name-certify-result': './src/asset/js/account/real-name-certify/result/index.js',
    'trucker-certify-result': './src/asset/js/account/trucker-certify/result/index.js'
  },
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
  plugins: [
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
    }),
    new HtmlWebpackPlugin({
      title: '社区',
      template: './src/page/index.ejs',
      filename: 'bbs.html',
      chunks: ['bbs', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发帖',
      template: './src/page/index.ejs',
      filename: 'bbs-post.html',
      chunks: ['bbs-post', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '帖子详情',
      template: './src/page/index.ejs',
      filename: 'bbs-detail.html',
      chunks: ['bbs-detail', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '评论',
      template: './src/page/index.ejs',
      filename: 'bbs-comment.html',
      chunks: ['bbs-comment', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '与我有关',
      template: './src/page/index.ejs',
      filename: 'bbs-about-me.html',
      chunks: ['bbs-about-me', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '登录',
      template: './src/page/index.ejs',
      filename: 'login.html',
      chunks: ['ved', 'fetch', 'login'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '注册',
      template: './src/page/index.ejs',
      filename: 'register.html',
      chunks: ['register', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找回密码',
      template: './src/page/index.ejs',
      filename: 'retrieve.html',
      chunks: ['retrieve', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '服务协议',
      template: './src/page/index.ejs',
      filename: 'term.html',
      chunks: ['term', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '话题帖子',
      template: './src/page/index.ejs',
      filename: 'topic-posts.html',
      chunks: ['topic-posts', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '用户帖子',
      template: './src/page/index.ejs',
      filename: 'user-posts.html',
      chunks: ['user-posts', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '人气用户',
      template: './src/page/index.ejs',
      filename: 'active-users.html',
      chunks: ['active-users', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '小妹公告',
      template: './src/page/index.ejs',
      filename: 'notice.html',
      chunks: ['notice', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源',
      template: './src/page/index.ejs',
      filename: 'pkg-pub.html',
      chunks: ['pkg-pub', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源-备注',
      template: './src/page/index.ejs',
      filename: 'pkg-pub-memo.html',
      chunks: ['pkg-pub-memo', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '用车需求',
      template: './src/page/index.ejs',
      filename: 'truck-requirement.html',
      chunks: ['truck-requirement', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布车源',
      template: './src/page/index.ejs',
      filename: 'truck-pub.html',
      chunks: ['truck-pub', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我的车队',
      template: './src/page/index.ejs',
      filename: 'roadtrain.html',
      chunks: ['roadtrain', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我的车队',
      template: './src/page/index.ejs',
      filename: 'my-roadtrain.html',
      chunks: ['my-roadtrain', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '添加车辆',
      template: './src/page/index.ejs',
      filename: 'truck-add.html',
      chunks: ['truck-add', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '常跑路线',
      template: './src/page/index.ejs',
      filename: 'select-truck-common-route.html',
      chunks: ['select-truck-common-route', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的货源',
      template: './src/page/index.ejs',
      filename: 'my-pkg.html',
      chunks: ['my-pkg', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的车源',
      template: './src/page/index.ejs',
      filename: 'my-truck.html',
      chunks: ['my-truck', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐货源',
      template: './src/page/index.ejs',
      filename: 'recommend-pkg-list.html',
      chunks: ['recommend-pkg-list', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐车源',
      template: './src/page/index.ejs',
      filename: 'recommend-truck-list.html',
      chunks: ['recommend-truck-list', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找货',
      template: './src/page/index.ejs',
      filename: 'pkg-search.html',
      chunks: ['pkg-search', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '筛选',
      template: './src/page/index.ejs',
      filename: 'search-filter.html',
      chunks: ['search-filter', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '货源详情',
      template: './src/page/index.ejs',
      filename: 'pkg-detail.html',
      chunks: ['pkg-detail', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐货源列表',
      template: './src/page/index.ejs',
      filename: 'today-pkg.html',
      chunks: ['today-pkg', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找车',
      template: './src/page/index.ejs',
      filename: 'truck-search.html',
      chunks: ['truck-search', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '车源详情',
      template: './src/page/index.ejs',
      filename: 'truck-detail.html',
      chunks: ['truck-detail', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐车源列表',
      template: './src/page/index.ejs',
      filename: 'today-truck.html',
      chunks: ['today-truck', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '货源信息',
      template: './src/page/index.ejs',
      filename: 'pkg-info-pub.html',
      chunks: ['pkg-info-pub', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '实名认证',
      template: './src/page/index.ejs',
      filename: 'real-name-certify.html',
      chunks: ['real-name-certify', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '司机认证',
      template: './src/page/index.ejs',
      filename: 'trucker-certify.html',
      chunks: ['trucker-certify', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '公司认证',
      template: './src/page/index.ejs',
      filename: 'company-certify.html',
      chunks: ['company-certify', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '公司认证',
      template: './src/page/index.ejs',
      filename: 'company-certify-result.html',
      chunks: ['company-certify-result', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '实名认证',
      template: './src/page/index.ejs',
      filename: 'real-name-certify-result.html',
      chunks: ['real-name-certify-result', 'fetch'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '司机认证',
      template: './src/page/index.ejs',
      filename: 'trucker-certify-result.html',
      chunks: ['trucker-certify-result', 'fetch'],
      chunksSortMode: 'dependency',
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
