import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
import Topic from './topic/';
import ActiveUser from './active-user/';

export default class BBS extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="bbs page">
        <HeadBar />
        <div className="tab-all">
          <NoticeBoard />
          <Post />
        </div>
        <div className="tab-hot">
          <Topic />
          <ActiveUser />
          <Post />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
