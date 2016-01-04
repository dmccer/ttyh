import './item.less';

import React from 'react';
import querystring from 'querystring';
import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';
import Avatar from '../../avatar/';

export default class ReportItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  viewForum(e) {
    e.preventDefault();
    e.stopPropagation();

    let post = this.props.item;

    const qs = querystring.stringify($.extend({}, this.state.qs, {
      fid: post.pid
    }));

    let url = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + qs);

    if (post.remind_count !== 0) {
      $.ajax({
        url: '/api/bbs_v2/clear_remind',
        type: 'POST',
        data: {
          id: post.id
        },
        success: () => {
          location.href = url;
        },
        error: () => {
          location.href = url;
        }
      });

      return;
    }

    location.href = url;
  }

  renderRemind() {
    return this.props.item.remind_count != 0 ? (
      <p className="reply-count">
        <span>{this.props.item.remind_count + ' 新回复'}</span>
      </p>
    ) : null;
  }

  render() {
    return (
      <div className="reply-item" onClick={this.viewForum.bind(this)}>
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} url={this.props.item.imgUrl} name={this.props.item.userName} size="s40" />
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
