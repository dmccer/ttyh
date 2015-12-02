import '../../less/page/bbs-detail.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';

export default class BBSDetail extends React.Component {
  constructor() {
    super();


    this.state = querystring.parse(location.search);
  }

  componentDidMount() {

  }

  render() {
    return (
      <section className="post-detail">
        <PostDetailItem id={this.state.id} />
        <Feedback postId={this.state.id} />
      </section>
    )
  }
}

ReactDOM.render(<BBSDetail />, $('#page').get(0));
