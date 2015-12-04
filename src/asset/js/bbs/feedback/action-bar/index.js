import './index.less';

import React from 'react';

export default class ActionBar extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="fb-action-bar">
        <ul className="grid">
          <li>
            <a href={'./bbs-comment.html?id=' + this.props.postId}>
              <i className="icon icon-edit"></i>评论
            </a>
          </li>
          <li onClick={this.props.onPraise}><i className="icon icon-praise"></i>赞</li>
        </ul>
      </div>
    )
  }
}
