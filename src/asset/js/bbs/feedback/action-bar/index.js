import './index.less';

import React from 'react';
import querystring from 'querystring';

export default class ActionBar extends React.Component {
  constructor() {
    super();
  }

  render() {
    const url = './bbs-comment.html?' + querystring.stringify({
      id: this.props.postId,
      tid: this.props.tid,
      uid: this.props.uid
    })
    return (
      <div className="fb-action-bar">
        <ul className="grid">
          <li>
            <a href={url}>
              <i className="icon icon-edit"></i>评论
            </a>
          </li>
          <li onClick={this.props.onPraise}><i className="icon icon-praise"></i>赞</li>
        </ul>
      </div>
    )
  }
}
