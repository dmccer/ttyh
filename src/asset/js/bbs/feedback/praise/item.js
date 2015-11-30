import './item.less';

import React from 'react';

export default class Praise extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <li className="praise-item">
        <div className="profile">
          <i className="avatar"></i>
          <div className="poster">用户名</div>
          <div className="post-meta"><span className="floor">1楼</span><i className="icon icon-clock"></i>刚刚</div>
        </div>
      </li>
    )
  }
}
