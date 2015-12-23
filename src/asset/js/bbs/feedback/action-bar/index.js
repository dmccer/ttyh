import './index.less';

import React from 'react';
import querystring from 'querystring';
import cx from 'classnames';

export default class ActionBar extends React.Component {
  constructor() {
    super();
  }

  comment(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onComment(this.props.forum);
  }

  praise() {
    this.props.onPraise(this.props.forum);
  }

  render() {
    return (
      <div className="fb-action-bar">
        <ul className="grid">
          <li>
            <a href="#" onClick={this.comment.bind(this)}>
              <i className="icon icon-edit s20 off"></i>评论
            </a>
          </li>
          <li onClick={this.praise.bind(this)}><i className={cx('icon icon-praise s20', this.props.praised ? 'on' : 'off')}></i>赞</li>
        </ul>
      </div>
    )
  }
}
