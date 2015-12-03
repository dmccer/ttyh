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
    $.ajax({
      url: '/posts',
      data: {
        q: q
      },
      type: 'GET',
      success: (data) => {
        this.setState({
          posts: data.list
        });
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
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
