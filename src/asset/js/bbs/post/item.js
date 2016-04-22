import './item.less';
import React from 'react';
import querystring from 'querystring';
import assign from 'lodash/object/assign';

import FullscreenImg from '../../fullscreen-img/';
import Emoj from '../emoj/';

import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';
import Gallery from '../gallery/';
import AH from '../../helper/ajax';
import {
  ClearRemind
} from '../model/';

export default class PostItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  componentDidMount() {
    this.ah = new AH();
  }

  viewForum(post, e) {
    e.preventDefault();
    e.stopPropagation();

    const qs = querystring.stringify(assign({}, this.state.qs, {
      fid: post.id
    }));

    if (post.remind_count !== 0) {
      this.ah.one(ClearRemind, () => {}, post.id);
    }

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + qs);
  }

  renderRemind() {
    return this.props.remind && this.props.item.remind_count != 0 ? (
      <p className="reply-count">
        <span>{this.props.item.remind_count + ' 新回复'}</span>
      </p>
    ) : null;
  }

  render() {
    let qs = querystring.stringify(assign({}, this.state.qs, {
      tid: this.props.item.tid,
      topic: this.props.item.topic
    }));

    let topicPostUrl = this.state.qs.tid
      ? 'javascript:void(0)'
      : ('./topic-posts.html?' + qs);

    return (
      <li className="post-item" onClick={this.viewForum.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} name={this.props.item.userName} url={this.props.item.imgUrl} size="s40" />
            <div className="poster">{this.props.item.userName}</div>
            <ReadableTime time={this.props.item.create_time} />
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit s15 disable"></i>{this.props.item.rcount}</span>
            <span><i className="icon icon-praise s15 disable"></i>{this.props.item.pcount}</span>
          </div>
        </header>
        <article className="post-body">
          <div className="title-container row">
            <h2>{this.props.item.title}</h2>
            <div>{this.renderRemind()}</div>
          </div>

          <section className="post-content">
            <p className="post-text">
              {
                (() => {
                    if (this.props.item.tid != 1) {
                      return (
                        <a href={topicPostUrl}><b>#{this.props.item.topic}#</b></a>
                      )
                    }
                })()
              }
              {Emoj.formatText(this.props.item.content)}
            </p>
            <Gallery imgs={this.props.item.imgs} wx_ready={this.props.wx_ready} />
          </section>
        </article>
      </li>
    );
  }
}
