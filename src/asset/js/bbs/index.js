import '../../less/global/global.less';
import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import $ from 'zepto';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
import HotPost from './post/hot';
import Topic from './topic/';
import ActiveUser from './active-user/';
import Loading from  '../loading/';
import Poptip from  '../poptip/';
import querystring from 'querystring';

export default class BBS extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: 'all', // all, focus, hot
      posts: [],
      qs: querystring.parse(location.search.substring(1))
    };
  }

  componentDidMount() {
    this.query(this.state.tab);
  }

  query(q) {
    let url;

    switch(q) {
      case 'all':
        url = '/mvc/bbs_v2/show_all';
        break;
      case 'focus':
        let qs = querystring.stringify({
          token: this.state.qs.token,
          f: 0
        });

        url = '/mvc/bbs_v2/show_follow_forums?' + qs;
        break;
      case 'hot':
        url = '/mvc/bbs_v2/hot_forum';
        break;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: url,
      type: 'GET',
      data: {
        t: 20
      },
      success: (data) => {
        this.formatForums(data.bbsForumList)

        this.setState({
          posts: data.bbsForumList
        });

        this.refs.loading.close();
      },
      error: () => {
        this.refs.loading.close();
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

    this.query(tab);
  }

  render() {
    return (
      <div className="bbs page">
        <HeadBar on={this.state.tab} onSwitch={this.switchTab.bind(this)}/>
        {
          (() => {
            switch (this.state.tab) {
              case 'all':
              case 'focus':
                return (
                  <div className="tab-all">
                    <NoticeBoard />
                    <Post items={this.state.posts} />
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
          })()
        }
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
