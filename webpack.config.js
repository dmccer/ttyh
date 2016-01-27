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
    term: './src/asset/js/term/index.js',
    'topic-posts': './src/asset/js/bbs/post/list-topic.js',
    'user-posts': './src/asset/js/bbs/post/list-user.js',
    'active-users': './src/asset/js/bbs/active-user/list.js',
    'notice': './src/asset/js/bbs/notice/index.js',
    
    'pkg-pub': './src/asset/js/pkg/pub/index.js',
    'pkg-pub-memo': './src/asset/js/pkg/pub/memo/index.js',
    'my-pkg': './src/asset/js/pkg/my/index.js',
    'recommend-pkg-list': './src/asset/js/pkg/recommend-list/index.js',
    'pkg-search': './src/asset/js/pkg/search/index.js',
    'today-pkg': './src/asset/js/pkg/today-list/',
    'pkg-detail': './src/asset/js/pkg/detail/index.js',

    'truck-pub': './src/asset/js/truck/pub/index.js',
    'roadtrain': './src/asset/js/truck/roadtrain/index.js',
    'truck-add': './src/asset/js/truck/add/index.js',
    'my-truck': './src/asset/js/truck/my/index.js',
    'recommend-truck-list': './src/asset/js/truck/recommend-list/index.js',
    'search-filter': './src/asset/js/truck/filter/index.js',
    'lib-react': ['react', 'react-dom'],
    ved: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server']
  },
  output: {
    path: path.resolve(__dirname, pkg.dest),
    publicPath: '',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    alias: {
      zepto: path.resolve(__dirname, './node_modules/zepto/dist/zepto.js'),
      'lodash-fn': path.resolve(__dirname, './node_modules/lodash/function.js')
    }
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('ved', 'ved.bundle.js'),
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
      chunks: ['bbs', 'zepto', 'lodash-fn', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发帖',
      template: './src/page/index.html',
      filename: 'bbs-post.html',
      chunks: ['bbs-post', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '帖子详情',
      template: './src/page/index.html',
      filename: 'bbs-detail.html',
      chunks: ['bbs-detail', 'zepto', 'lodash-fn', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '评论',
      template: './src/page/index.html',
      filename: 'bbs-comment.html',
      chunks: ['bbs-comment', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '与我有关',
      template: './src/page/index.html',
      filename: 'bbs-about-me.html',
      chunks: ['bbs-about-me', 'zepto', 'lodash-fn', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '登录',
      template: './src/page/index.html',
      filename: 'login.html',
      chunks: ['login', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '注册',
      template: './src/page/index.html',
      filename: 'register.html',
      chunks: ['register', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找回密码',
      template: './src/page/index.html',
      filename: 'retrieve.html',
      chunks: ['retrieve', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '服务协议',
      template: './src/page/index.html',
      filename: 'term.html',
      chunks: ['term', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '话题帖子',
      template: './src/page/index.html',
      filename: 'topic-posts.html',
      chunks: ['topic-posts', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '用户帖子',
      template: './src/page/index.html',
      filename: 'user-posts.html',
      chunks: ['user-posts', 'zepto', 'lodash-fn', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '人气用户',
      template: './src/page/index.html',
      filename: 'active-users.html',
      chunks: ['active-users', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '小妹公告',
      template: './src/page/index.html',
      filename: 'notice.html',
      chunks: ['notice', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源',
      template: './src/page/index.html',
      filename: 'pkg-pub.html',
      chunks: ['pkg-pub', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布货源-备注',
      template: './src/page/index.html',
      filename: 'pkg-pub-memo.html',
      chunks: ['pkg-pub-memo', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '发布车源',
      template: './src/page/index.html',
      filename: 'truck-pub.html',
      chunks: ['truck-pub', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我的车队',
      template: './src/page/index.html',
      filename: 'roadtrain.html',
      chunks: ['roadtrain', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '添加车辆',
      template: './src/page/index.html',
      filename: 'truck-add.html',
      chunks: ['truck-add', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的货源',
      template: './src/page/index.html',
      filename: 'my-pkg.html',
      chunks: ['my-pkg', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '我发布的车源',
      template: './src/page/index.html',
      filename: 'my-truck.html',
      chunks: ['my-truck', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐货源',
      template: './src/page/index.html',
      filename: 'recommend-pkg-list.html',
      chunks: ['recommend-pkg-list', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '推荐车源',
      template: './src/page/index.html',
      filename: 'recommend-truck-list.html',
      chunks: ['recommend-truck-list', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '找货',
      template: './src/page/index.html',
      filename: 'pkg-search.html',
      chunks: ['pkg-search', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '筛选',
      template: './src/page/index.html',
      filename: 'search-filter.html',
      chunks: ['search-filter', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '货源详情',
      template: './src/page/index.html',
      filename: 'pkg-detail.html',
      chunks: ['pkg-detail', 'zepto', 'ved'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      title: '今日货源列表',
      template: './src/page/index.html',
      filename: 'today-pkg.html',
      chunks: ['today-pkg', 'zepto', 'ved'],
      inject: 'body'
    })
  ],
  module: {
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
        // target: 'http://o.dp:3000',
        target: 'http://api.ttyhuo.com:83',
        secure: false
      },
      '/mvc/code_msg*': {
        target: 'http://api.ttyhuo.com:83',
        secure: false
      },
      // '/mvc/searchProductsForH5': {
      //   target: 'http://121.42.200.139',
      //   secure: false
      // },
      // '/mvc/searchMyProductsForH5': {
      //   target: 'http://121.42.200.139',
      //   secure: false
      // },
      '/mvc*': {
        target: 'http://api.ttyhuo.com:85',
        secure: false
      },
      '/api*': {
        target: 'http://o.dp:3000',
        // target: 'http://m.ttyhuo.com',
        secure: false
      },
      '/*.jsp*': {
        target: 'http://m.ttyhuo.com/bbs',
        secure: false
      }
    }
  }
};
