import React from 'react';

import Comment from './comment';

export default class CommentList extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ul className="comment-list">
        <Comment />
        <Comment />
        <Comment />
      </ul>
    );
  }
}
