import '../../less/global/global.less';
import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import querystring from 'querystring';
import fnu from 'lodash-fn';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
import HotPost from './post/hot';
import Topic from './topic/';
import ActiveUser from './active-user/';
import Loading from  '../loading/';
import Poptip from  '../poptip/';
import LoginBtn from './login-btn/';
import LoadMore from '../load-more/';
import GoTop from '../gotop/';
import JWeiXin from '../jweixin/';

export default class BBS extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      tab: query.tab || 'all', // all, focus, hot
      posts: [],
      qs: query,
      last: null,
      f: 0,
      t: 30,
      count: 0
    };

    new JWeiXin(() => {
      this.setState({
        wx_ready: true
      });
    });
  }

  componentDidMount() {
    this.query(this.state.tab);

    LoadMore.init(() => {
      this.query(this.state.tab);
    });

    let winH = $(window).height();
    $(window).on('scroll', fnu.debounce(() => {
      let t = $(window).scrollTop();
      let on = t > 1.5 * winH;

      this.setState({
        hasGoTop: on
      });
    }));
  }

  query(q) {
    let f = this.state.f;

    if (this.state.last === q) {
      f += this.state.count;
    } else {
      f = 0;
    }

    if (q === 'hot' && this.state.last === 'hot') {
      this.refs.poptip.info('没有更多帖子啦');

      return;
    }

    let url;

    switch(q) {
      case 'all':
        url = '/api/bbs_v2/show_all';
        break;
      case 'focus':
        url = '/api/bbs_v2/show_follow_forums?';
        break;
      case 'hot':
        url = '/api/bbs_v2/hot_forum';
        break;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: url,
      type: 'GET',
      cache: false,
      data: {
        t: this.state.t,
        f: f
      },
      success: (data) => {
        this.refs.loading.close();

        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.formatForums(data.bbsForumList)

          this.setState({
            posts: f > 0 ? this.state.posts.concat(data.bbsForumList) : data.bbsForumList,
            f: f,
            count: data.bbsForumList.length,
            last: q
          });

          return;
        }

        if (this.state.posts.length) {
          this.refs.poptip.info('没有更多了');
        }
      },
      error: (xhr) => {
        this.refs.loading.close();

        if (xhr.status === 403) {
          let qs = querystring.stringify(this.state.qs);

          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/login.html?${qs}`);
        }
      }
    });
  }

  formatForums(list: Array<Object>) {
    list.forEach((item) => {
      item.imgs = item.imgs_url ? item.imgs_url.split(';') : [];
    });
  }

  switchTab(tab: string) {
    this.setState({
      tab: tab
    });

    let qs = querystring.stringify($.extend({}, this.state.qs, { tab: tab }));
    location.replace(location.protocol + '//' + location.host + location.pathname + '?' + qs);

    // this.query(tab);
  }

  renderLoginBtn() {
    if (!this.state.qs.token || !this.state.qs.uid) {
      return <LoginBtn />;
    }
  }

  renderPosts() {
    switch (this.state.tab) {
      case 'all':
      case 'focus':
        return (
          <div className="tab-all">
            <NoticeBoard />
            <Post items={this.state.posts} wx_ready={this.state.wx_ready} />
          </div>
        )
      case 'hot':
        return (
          <div className="tab-hot">
            <Topic />
            <ActiveUser />
            <HotPost items={this.state.posts} />
          </div>
        )
    }
  }

  render() {
    return (
      <div className="bbs page">
        <HeadBar on={this.state.tab} onSwitch={this.switchTab.bind(this)}/>
        {this.renderPosts()}
        <GoTop />
        {this.state.hasGoTop ? null : this.renderLoginBtn()}
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
