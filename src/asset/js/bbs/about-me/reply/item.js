import './item.less';

import React from 'react';
import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';
import Avatar from '../../avatar/';

export default class ReportItem extends React.Component {
  constructor() {
    super()
  }

  touchstart(e) {
    this._start = new Date().getTime();
  }

  touchend(e) {
    if (Date.now() - this._start >= 3000) {
      if (confirm('确认删除该条回复?')) {
        this.props.remove(this.props.item);
      }
    } else {
      this._start = null;
    }
  }

  viewForum() {
    let post = this.props.item;

    const qs = querystring.stringify($.extend({}, this.state.qs, {
      fid: post.pid
    }));

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + qs);
  }

  renderRemind() {
    return this.props.item.remind_count != 0 ? (
      <p className="reply-count" onClick={this.viewForum.bind(this)}>
        <span>{this.props.item.remind_count + ' 新回复'}</span>
      </p>
    ) : null;
  }

  render() {
    return (
      <div className="reply-item" onTouchStart={this.touchstart.bind(this)} onTouchEnd={this.touchend.bind(this)}>
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} url={this.props.item.imgUrl} size="s40" />
            <div className="poster">{this.props.item.userName}</div>
            <div className="post-meta">
              <ReadableTime time={this.props.item.create_time} />
            </div>
          </div>
          <div className="post-feedback">
            <div className="post-feedback-inner">
              <p className="praise-count">
                <i className="icon icon-praise s15 disable"></i>
                <span>{this.props.item.pcount}</span>
              </p>
              {this.renderRemind()}
            </div>
          </div>
        </header>
        <article className="post-body">
          <p className="post-text">{Emoj.formatText(this.props.item.content)}</p>
        </article>
      </div>
    )
  }
}
