import './item.less';

import React from 'react';

export default class Praise extends React.Component {
  constructor() {
    super()
  }

  render() {
    let praiseItem = this.props.item;

    return (
      <li className="praise-item">
        <div className="profile">
          <img className="avatar" src={praiseItem.imgUrl} />
          <div className="poster">{praiseItem.userName}</div>
          <div className="post-meta">
            <span className="floor">{this.props.item.floor}楼</span>
            <i className="icon icon-clock"></i>
            {new Date(this.props.item.do_time).toLocaleDateString().substring(5).replace('/', '-')}
          </div>
        </div>
      </li>
    )
  }
}
