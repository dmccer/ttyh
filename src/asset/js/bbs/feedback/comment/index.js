import React from 'react';

import Comment from './item';

export default class CommentList extends React.Component {
  constructor() {
    super()
  }

  render() {
    let commentList = this.props.items.map((item, index) => {
      return <Comment key={'comment_' + index} item={item} />
    })

    return (
      <ul className="comment-list">
        {commentList}
      </ul>
    );
  }
}
