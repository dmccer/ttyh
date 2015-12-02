import './index.less';

import React from 'react';

import PostItem from './item';

export default class Post extends React.Component {
  constructor() {
    super()
  }
  
  render() {
    var list = this.props.items.map((post, index) => {
      return <PostItem key={'post_' + index} item={post} />
    });

    return (
      <section className="post">
        <ul className="posts scroll-list">
          {list}
        </ul>
      </section>
    );
  }
}
