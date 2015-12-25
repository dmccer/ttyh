import '../../less/global/global.less';
import '../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';
import GoTop from '../gotop/';


export default class BBSDetail extends React.Component {
  constructor() {
    super();

    this.state = querystring.parse(location.search.substring(1));
  }

  loadForum(forum: Object) {
    this.setState({
      tid: forum.tid,
      uid: forum.uid,
      rcount: forum.rcount,
      pcount: forum.pcount
    });
  }

  onPraise() {
    
  }

  render() {
    return (
      <section className="post-detail">
        <PostDetailItem fid={this.state.fid} onLoadForum={this.loadForum.bind(this)}/>
        <Feedback
          fid={this.state.fid}
          tid={this.state.tid}
          uid={this.state.uid}
          rcount={this.state.rcount}
          pcount={this.state.pcount}
          onPraise={this.state.onPraise}
        />
        <GoTop />
      </section>
    )
  }
}

ReactDOM.render(<BBSDetail />, $('#page').get(0));
