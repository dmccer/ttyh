import './item.less';

import React from 'react';
import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';

export default class ReportItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="reply-item">
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
                <i className="icon icon-praise"></i>
                <span>{this.props.item.pcount}</span>
              </p>
              {
                (() => {
                  if (this.props.item.remind_count != 0) {
                    return (
                      <p className="reply-count">
                        <i className="icon icon-edit"></i>
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
