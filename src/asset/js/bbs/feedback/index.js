import './index.less';

import React from 'react';
import CommentList from './comment/';
import PraiseList from './praise/';

export default class Feedback extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="feedback">
        <ul className="feedback-type-tabs">
          <li className="on"><a href="#">评论</a></li>
          <li><a href="#">赞</a></li>
        </ul>
        <CommentList />
        <PraiseList />
      </section>
    )
  }
}
