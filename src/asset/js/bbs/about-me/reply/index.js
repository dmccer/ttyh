import './index.less';

import React from 'react';
import ReplyItem from './item';

export default class ReplyList extends React.Component {
  constructor() {
    super();
  }

  remove(reply: Object) {
    this.props.remove(reply);
  }

  render() {
    var replyList = this.props.items.map((item, index) => {
      return <ReplyItem item={item} key={'reply_' + index} remove={this.remove.bind(this)} />
    });

    return (
      <section className="reply-list">
        {replyList}
      </section>
    )
  }
}
