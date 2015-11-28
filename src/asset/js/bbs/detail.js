import '../../less/page/bbs-detail.less';

import React from 'react';
import ReactDOM from 'react-dom';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';

export default class BBSDetail extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="post-detail">
        <PostDetailItem />
        <Feedback />
      </section>
    )
  }
}

ReactDOM.render(<BBSDetail />, $('#page').get(0));
