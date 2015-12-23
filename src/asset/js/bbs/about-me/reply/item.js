import './item.less';

import React from 'react';
import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';

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

  render() {
    // <i className="icon icon-edit s15 disable"></i>

    return (
      <div className="reply-item" onTouchStart={this.touchstart.bind(this)} onTouchEnd={this.touchend.bind(this)}>
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.imgUrl} />
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
              {
                (() => {
                  if (this.props.item.remind_count != 0) {
                    return (
                      <p className="reply-count">
                        <span>{this.props.item.remind_count + ' 新回复'}</span>
                      </p>
                    )
                  }
                })()
              }
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
