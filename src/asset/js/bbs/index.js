import '../../less/global/global.less';
import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import querystring from 'querystring';
import debounce from 'lodash/function/debounce';
import cookie from 'react-cookie';
import assign from 'lodash/object/assign';

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
import $ from '../helper/z';
import EventListener from 'fbjs/lib/EventListener';
import AH from '../helper/ajax';
import {
  AllForums,
  FollowedForums,
  HotForums
} from './model/';

export default class BBS extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    let token = cookie.load('token');
    let uid = cookie.load('uid');

    if (token) {
      localStorage.setItem('user', JSON.stringify({
        token: token,
        uid: uid
      }));
    }

    this.state = {
      tab: query._bbstab || 'all', // all, focus, hot
      posts: [],
      qs: query,
      localUser: JSON.parse(localStorage.getItem('user')),
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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.query(this.state.tab);

    LoadMore.init(() => {
      this.query(this.state.tab);
    });

    let winH = $.height(window);
    EventListener.listen(window, 'scroll', debounce(() => {
      let t = $.scrollTop(window);
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

    let Forums, data = {
      t: this.state.t,
      f: f
    };

    switch(q) {
      case 'all':
        Forums = AllForums;
        break;
      case 'focus':
        data.token = this.state.localUser && this.state.localUser.token || null;
        Forums = FollowedForums;
        break;
      case 'hot':
        Forums = HotForums;
        break;
    }

    this.ah.one(Forums, (data) => {
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
    }, data);
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

    let qs = querystring.stringify(assign({}, this.state.qs, { _bbstab: tab }));
    location.replace(location.protocol + '//' + location.host + location.pathname + '?' + qs);
  }

  renderLoginBtn() {
    if (!this.state.localUser || !this.state.localUser.token || !this.state.qs.uid) {
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
            <HotPost items={this.state.posts} wx_ready={this.state.wx_ready} />
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

ReactDOM.render(<BBS />, document.querySelector('.page'));
