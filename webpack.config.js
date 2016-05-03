var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

function createPage(title, pageName) {
  return new HtmlWebpackPlugin({
    title: title,
    template: './src/page/index.ejs',
    filename: pageName + '.html',
    chunks: [pageName, 'fetch', 'ved'],
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
    'real-name-certify-result': './src/asset/js/account/real-name-certify/result/index.js',
    'trucker-certify-result': './src/asset/js/account/trucker-certify/result/index.js',

    report: './src/asset/js/report/index.js',

    ved: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server']
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
    // end 货主

    createPage('筛选', 'search-filter'),

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
    // end 车主

    // start 认证
    createPage('实名认证', 'real-name-certify'),
    createPage('司机认证', 'trucker-certify'),
    createPage('公司认证', 'company-certify'),
    createPage('实名认证结果', 'real-name-certify-result'),
    createPage('公司认证结果', 'company-certify-result'),
    createPage('司机认证结果', 'trucker-certify-result'),
    // end 认证

    new webpack.optimize.CommonsChunkPlugin('ved', 'ved.js'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'fetch',
      chunks: ['fetch']
    }),
    new webpack.ProvidePlugin({
      'Promise': 'promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      title: '社区',
      template: './src/page/index.ejs',
      filename: 'bbs.html',
      chunks: ['bbs', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发帖',
      template: './src/page/index.ejs',
      filename: 'bbs-post.html',
      chunks: ['bbs-post', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '帖子详情',
      template: './src/page/index.ejs',
      filename: 'bbs-detail.html',
      chunks: ['bbs-detail', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '评论',
      template: './src/page/index.ejs',
      filename: 'bbs-comment.html',
      chunks: ['bbs-comment', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '与我有关',
      template: './src/page/index.ejs',
      filename: 'bbs-about-me.html',
      chunks: ['bbs-about-me', 'fetch', 'ved'],
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
      chunks: ['register', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找回密码',
      template: './src/page/index.ejs',
      filename: 'retrieve.html',
      chunks: ['retrieve', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '服务协议',
      template: './src/page/index.ejs',
      filename: 'term.html',
      chunks: ['term', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '话题帖子',
      template: './src/page/index.ejs',
      filename: 'topic-posts.html',
      chunks: ['topic-posts', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '用户帖子',
      template: './src/page/index.ejs',
      filename: 'user-posts.html',
      chunks: ['user-posts', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '人气用户',
      template: './src/page/index.ejs',
      filename: 'active-users.html',
      chunks: ['active-users', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '小妹公告',
      template: './src/page/index.ejs',
      filename: 'notice.html',
      chunks: ['notice', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源',
      template: './src/page/index.ejs',
      filename: 'pkg-pub.html',
      chunks: ['pkg-pub', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源-备注',
      template: './src/page/index.ejs',
      filename: 'pkg-pub-memo.html',
      chunks: ['pkg-pub-memo', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '用车需求',
      template: './src/page/index.ejs',
      filename: 'truck-requirement.html',
      chunks: ['truck-requirement', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布车源',
      template: './src/page/index.ejs',
      filename: 'truck-pub.html',
      chunks: ['truck-pub', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我的车队',
      template: './src/page/index.ejs',
      filename: 'roadtrain.html',
      chunks: ['roadtrain', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我的车队',
      template: './src/page/index.ejs',
      filename: 'my-roadtrain.html',
      chunks: ['my-roadtrain', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '添加车辆',
      template: './src/page/index.ejs',
      filename: 'truck-add.html',
      chunks: ['truck-add', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '常跑路线',
      template: './src/page/index.ejs',
      filename: 'select-truck-common-route.html',
      chunks: ['select-truck-common-route', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的货源',
      template: './src/page/index.ejs',
      filename: 'my-pkg.html',
      chunks: ['my-pkg', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的车源',
      template: './src/page/index.ejs',
      filename: 'my-truck.html',
      chunks: ['my-truck', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐货源',
      template: './src/page/index.ejs',
      filename: 'recommend-pkg-list.html',
      chunks: ['recommend-pkg-list', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐车源',
      template: './src/page/index.ejs',
      filename: 'recommend-truck-list.html',
      chunks: ['recommend-truck-list', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找货',
      template: './src/page/index.ejs',
      filename: 'pkg-search.html',
      chunks: ['pkg-search', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '筛选',
      template: './src/page/index.ejs',
      filename: 'search-filter.html',
      chunks: ['search-filter', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '货源详情',
      template: './src/page/index.ejs',
      filename: 'pkg-detail.html',
      chunks: ['pkg-detail', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐货源列表',
      template: './src/page/index.ejs',
      filename: 'today-pkg.html',
      chunks: ['today-pkg', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找车',
      template: './src/page/index.ejs',
      filename: 'truck-search.html',
      chunks: ['truck-search', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '车源详情',
      template: './src/page/index.ejs',
      filename: 'truck-detail.html',
      chunks: ['truck-detail', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐车源列表',
      template: './src/page/index.ejs',
      filename: 'today-truck.html',
      chunks: ['today-truck', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '货源信息',
      template: './src/page/index.ejs',
      filename: 'pkg-info-pub.html',
      chunks: ['pkg-info-pub', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '实名认证',
      template: './src/page/index.ejs',
      filename: 'real-name-certify.html',
      chunks: ['real-name-certify', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '司机认证',
      template: './src/page/index.ejs',
      filename: 'trucker-certify.html',
      chunks: ['trucker-certify', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '公司认证',
      template: './src/page/index.ejs',
      filename: 'company-certify.html',
      chunks: ['company-certify', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '公司认证',
      template: './src/page/index.ejs',
      filename: 'company-certify-result.html',
      chunks: ['company-certify-result', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '实名认证',
      template: './src/page/index.ejs',
      filename: 'real-name-certify-result.html',
      chunks: ['real-name-certify-result', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '司机认证',
      template: './src/page/index.ejs',
      filename: 'trucker-certify-result.html',
      chunks: ['trucker-certify-result', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '举报',
      template: './src/page/index.ejs',
      filename: 'report.html',
      chunks: ['report', 'fetch', 'ved'],
      chunksSortMode: 'dependency',
      inject: 'body'
    })
  ],

  debug: true,
  watch: true,
  output: {
    path: path.resolve(__dirname, pkg.dest),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/index.js'),
      fetch: path.resolve(__dirname, './node_modules/whatwg-fetch/')
    }
  },
  module: {
    noParse: /\.min\.js$/,
    preLoaders: [{
      test: /\.js?$/,
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
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: [
        'react-hot',
        'babel-loader'
      ]
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
      '/app*': {
        target: 'http://m.ttyhuo.com:83',
        secure: false
      },
      '/mvc/bbs*': {
        target: 'http://m.ttyhuo.com:83',
        secure: false
      },
      '/api*': {
        target: 'http://m.ttyhuo.com:83',
        secure: false
      },
      '/mvc/code_msg*': {
        target: 'http://test.ttyhuo.com/',
        secure: false
      },
      '/mvc*': {
        target: 'http://test.ttyhuo.com/',
        secure: false
      }
    }
  }
};
