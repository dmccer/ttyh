import React from 'react';

import PostItem from './item';

export default class Post extends React.Component {
  constructor() {
    super()
  }

  render() {
    let list = this.props.items.map((post, index) => {
      return <PostItem key={'post_' + index} remind={this.props.remind} item={post} wx_ready={this.props.wx_ready} />
    });

    if (!list.length) {
      list = <div className="empty-list">没有数据</div>;
    }

    return (
      <section className="post">
        <ul className="posts scroll-list">
          {list}
        </ul>
      </section>
    );
  }
}
