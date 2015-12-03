import React from 'react';

import PostItem from './item';

export default class HotPost extends React.Component {
  constructor() {
    super()
  }

  render() {
    var list = this.props.items.map((post, index) => {
      return <PostItem key={'post_' + index} item={post} />
    });

    return (
      <section className="post">
        <h2 className="subtitle">热帖</h2>
        <ul className="posts scroll-list">
          {list}
        </ul>
      </section>
    );
  }
}
