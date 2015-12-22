import './item.less';
import React from 'react';

import FullscreenImg from '../../fullscreen-img/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';
import Gallery from '../gallery/';

export default class PostItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  handleClickItem(post) {
    const qs = querystring.stringify($.extend({}, this.state.qs, {
      fid: post.id,
      tid: post.tid
    }));

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + qs);
  }

  render() {
    let qs = querystring.stringify($.extend({}, this.state.qs, {
      tid: this.props.item.tid
    }));

    let topicPostUrl = this.state.qs.tid
      ? 'javascript:void(0)'
      : ('./topic-posts.html?' + qs);

    return (
      <li className="post-item" onClick={this.handleClickItem.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} url={this.props.item.imgUrl} size="s40" />
            <div className="poster">{this.props.item.userName}</div>
            <ReadableTime time={this.props.item.create_time} />
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit s15 disable"></i>{this.props.item.rcount}</span>
            <span><i className="icon icon-praise s15 disable"></i>{this.props.item.pcount}</span>
          </div>
        </header>
        <article className="post-body">
          <h2>{this.props.item.title}</h2>
          <section className="post-content">
            <p className="post-text">
              <a href={topicPostUrl}><b>#{this.props.item.topic}#</b></a>
              {Emoj.formatText(this.props.item.content)}
            </p>
            <Gallery imgs={this.props.item.imgs} wx_ready={this.props.wx_ready} />
          </section>
        </article>
      </li>
    );
  }
}
