import './item.less';

import React from 'react';

export default class ReportItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    // <img className="avatar" src={this.props.item.user.avatar} />
    // <div className="poster">{this.props.item.user.nickname}</div>

    return (
      <div className="reply-item">
        <header className="row">
          <div className="profile">
            <div className="post-meta">
              <i className="icon icon-clock"></i>{new Date(this.props.item.create_time).toLocaleDateString().substring(5).replace('/', '-')}
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
          <p className="post-text">{this.props.item.content}</p>
        </article>
      </div>
    )
  }
}
