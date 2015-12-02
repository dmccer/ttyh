import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
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
    $.ajax({
      url: '/bbs',
      type: 'GET',
      success: (data) => {
        this.setState({
          posts: data.list
        });
      }
    })
  }

  switchTab(tab: string) {
    this.setState({
      tab: tab
    });
  }

  render() {
    var allPanelClassNames = classNames("tab-all", this.state.tab === 'all' ? '' : 'hide');
    var hotPanelClassNames = classNames("tab-hot", this.state.tab === 'hot' ? '' : 'hide');

    return (
      <div className="bbs page">
        <HeadBar on={this.state.tab} onSwitch={this.switchTab.bind(this)}/>
        <div className={allPanelClassNames}>
          <NoticeBoard />
          <Post items={this.state.posts} />
        </div>
        <div className={hotPanelClassNames}>
          <Topic />
          <ActiveUser />
          <Post items={this.state.posts} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
