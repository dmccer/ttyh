import '../../less/global/global.less';
import '../../less/page/bbs-detail.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';

export default class BBSDetail extends React.Component {
  constructor() {
    super();

    this.state = querystring.parse(location.search.substring(1));
  }

  loadForum(forum: Object) {
    this.setState({
      tid: forum.tid
    });
  }

  render() {
    return (
      <section className="post-detail">
        <PostDetailItem fid={this.state.fid} onLoadForum={this.loadForum.bind(this)}/>
        <Feedback fid={this.state.fid} tid={this.state.tid} />
      </section>
    )
  }
}

ReactDOM.render(<BBSDetail />, $('#page').get(0));
