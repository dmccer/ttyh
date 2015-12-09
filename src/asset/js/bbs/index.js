import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
import HotPost from './post/hot';
import Topic from './topic/';
import ActiveUser from './active-user/';
import Loading from  '../loading/';

export default class BBS extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: 'all', // all, focus, hot
      posts: []
    };
  }

  componentDidMount() {
    this.query(this.state.tab);
  }

  query(q) {
    let url;

    switch(q) {
      case 'all':
        url = '/mvc/bbs/show_all';
        break;
      case 'focus':
        url = '/mvc/bbs/show_more_forum';
        break;
      case 'hot':
        url = '/mvc/bbs/hot_forum';
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
        data.bbsForumList.forEach((item) => {
          item.imgs = item.imgs_url ? item.imgs_url.split(';') : [];
        });

        this.setState({
          posts: data.bbsForumList
        });

        this.refs.loading.close();
      }
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
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
