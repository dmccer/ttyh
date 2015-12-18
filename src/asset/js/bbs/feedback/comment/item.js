import './item.less';

import React from 'react';
import Emoj from '../../emoj/';
import ReadableTime from '../../readable-time/';
import querystring from 'querystring';

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
    this.props.onComment(this.props.item);
  }

  render() {
    return (
      <li className="comment-item">
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.imgUrl} />
            <div className="poster">{this.props.item.userName}</div>
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
            <span onClick={this.praise.bind(this)}><i className="icon icon-praise s15 off"></i>{this.props.item.pcount}</span>
            <span onClick={this.comment.bind(this)}><i className="icon icon-edit s15 off"></i>{this.props.item.rcount}</span>
          </div>
        </header>
        <article className="post-body">
          <section className="post-content">
            <p className="post-text">{Emoj.formatText(this.props.item.content)}</p>
            {
              (() => {
                if (this.props.item.replied) {
                  return (
                    <div className="replied">
                      <i className="icon icon-quote">『</i>
                      <p className="replied-content"><span className="head">回复<b>{this.props.item.replied.floor}</b>楼: </span>{this.props.item.replied.text}</p>
                    </div>
                  )
                }
              })()
            }
          </section>
        </article>
      </li>
    )
  }
}
