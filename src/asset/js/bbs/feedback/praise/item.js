import './item.less';

import React from 'react';
import Avatar from '../../avatar/';
import ReadableTime from '../../readable-time/';

export default class Praise extends React.Component {
  constructor() {
    super()
  }

  render() {
    let praiseItem = this.props.item;
    let lz = praiseItem.uid === this.props.uid ? <i className="ticon louzhu light-purple"></i> : null;

    return (
      <li className="praise-item">
        <div className="profile">
          <Avatar uid={praiseItem.uid} name={praiseItem.userName} url={praiseItem.imgUrl} size="s40" />
          <div className="poster">
            {praiseItem.userName}
            {lz}
          </div>
          <div className="post-meta">
            <span className="floor">{this.props.item.floor}楼</span>
            <i className="icon icon-clock"></i>
            <ReadableTime time={this.props.item.do_time} />
          </div>
        </div>
      </li>
    )
  }
}
