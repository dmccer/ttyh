import './item.less';

import React from 'react';
import querystring from 'querystring';
import cx from 'classnames';

import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';
import Avatar from '../../avatar/';
import Gallery from '../../gallery/';

export default class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  praise() {
    this.props.onPraise(this.props.item);
  }

  comment() {
    this.props.onComment(this.props.item, 1);
  }

  renderReplied() {
    return this.props.item.cid !== 0 ? (
      <div className="replied">
        <i className="icon icon-quote s12"></i>
        <p className="replied-content"><span className="head">回复<b>{this.props.item.cid}</b>楼: </span>{Emoj.formatText(this.props.item.replied.content)}</p>
      </div>
    ) : null;
  }

  render() {
    let lz = this.props.item.uid === this.props.uid ? <i className="ticon louzhu light-purple"></i> : null;

    return (
      <li className="comment-item">
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} name={this.props.item.userName} url={this.props.item.imgUrl} size="s40" />
            <div className="poster">
              {this.props.item.userName}
              {lz}
            </div>
            <div className="post-meta">
              {
                (() => {
                  if (this.props.item.floor != null) {
                    return (<span className="floor">{this.props.item.floor}楼</span>)
                  }
                })()
              }
              <ReadableTime time={this.props.item.create_time} />
            </div>
          </div>
          <div className="post-feedback">
            <span onClick={this.praise.bind(this)}><i className={cx('icon icon-praise s15', this.props.item.ipraised ? 'on' : 'off')}></i>{this.props.item.pcount}</span>
            <span onClick={this.comment.bind(this)}><i className="icon icon-edit s15 off"></i></span>
          </div>
        </header>
        <article className="post-body">
          <section className="post-content">
            <p className="post-text">{Emoj.formatText(this.props.item.content)}</p>
            <Gallery imgs={this.props.item.imgs} wx_ready={this.props.wx_ready} />
            {this.renderReplied()}
          </section>
        </article>
      </li>
    )
  }
}
