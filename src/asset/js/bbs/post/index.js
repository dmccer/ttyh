import './index.less';

import React from 'react';

import PostItem from './item';

export default class Post extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="post">
        <ul className="posts scroll-list">
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
        </ul>
      </section>
    );
  }
}
