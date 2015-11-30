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
          <li><i className="icon icon-edit"></i>评论</li>
          <li><i className="icon icon-praise"></i>赞</li>
        </ul>
      </div>
    )
  }
}
