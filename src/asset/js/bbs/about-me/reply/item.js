import './item.less';

import React from 'react';

export default class ReportItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="reply-item">
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.user.avatar} />
            <div className="poster">{this.props.item.user.nickname}</div>
            <div className="post-meta">
              <i className="icon icon-clock"></i>{this.props.item.time}
            </div>
          </div>
          <div className="post-feedback">
            <div className="post-feedback-inner">
              <p className="praise-count">
                <i className="icon icon-praise"></i>
                <span>{this.props.item.praise_count}</span>
              </p>
              {
                (() => {
                  if (this.props.item.reply_count != null) {
                    return (
                      <p className="reply-count">
                        <i className="icon icon-edit"></i>
                        <span>{this.props.item.reply_count + ' 新回复'}</span>
                      </p>
                    )
                  }
                })()
              }
            </div>
          </div>
        </header>
        <article className="post-body">
          <p className="post-text">{this.props.item.text}</p>
        </article>
      </div>
    )
  }
}
