import './item.less';

import React from 'react';
import classNames from 'classnames';
import assign from 'lodash/object/assign';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';

const WH_REG = /\[\d+:\d+\]/g;

export default class PostDetailItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    };
  }

  componentWillMount() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.uid) {
      this.setState({
        currUid: user.uid
      });
    }
  }

  render_follow() {
    let forum = this.props.forum;

    if (forum.uid !== this.state.currUid) {
      if (forum.follow === 1) {
        return (
          <span
            className="followed">
            <i className="icon icon-correct s20"></i>
            <span><b>已关注</b></span>
          </span>
        )
      }

      return (
        <span
          className="follow"
          onClick={this.props.follow.bind(this)}>
          <i className="icon icon-plus"></i>
          <span><b>关注</b></span>
        </span>
      );
    } else {
      return (
        <span className="del" onClick={this.props.del.bind(this)}><i className="icon icon-del s20"></i>删除</span>
      );
    }
  }

  renderTIcon() {
    let ticons = []

    let forum = this.props.forum;

    if (forum.good === 1) {
      ticons.push(<i className="ticon jing teal" key="ticon-item-jing"></i>);
    }

    if (forum.sort === 1) {
      ticons.push(<i className="ticon ding orange" key="ticon-item-ding"></i>);
    }

    if (forum.uid == 25946) {
      ticons.push(<i className="ticon guan light-purple" key="ticon-item-guan"></i>);
    }

    return ticons;
  }

  _render() {
    let forum = this.props.forum;

    if (!forum) {
      return;
    }

    let imgs = forum.imgs.map((img, index) => {
      return <a href="javascript:void(0)" key={'img-item_' + index}><img src={img.replace(WH_REG, '')} /></a>
    });

    let topicPostUrl = './topic-posts.html?' + querystring.stringify(assign({}, this.state.qs, {
      tid: forum.tid,
      topic: forum.topic
    }));

    return (
      <section className="post-item">
        <header className="row">
          <div className="profile">
            <Avatar uid={forum.uid} name={forum.userName} url={forum.imgUrl} size="s40" />
            <div className="poster">
              {forum.userName}
              <i className="ticon louzhu light-purple"></i>
            </div>
            <div className="">
              {this.renderTIcon()}
              <ReadableTime time={forum.create_time} />
            </div>
          </div>
          <div className="poster-actions">
            {this.render_follow()}
          </div>
        </header>
        <article className="post-body">
          <div className="post-title">
            <span className="browse-count">被浏览 <b>{forum.bcount}</b> 次</span>
            <h2>{forum.title}</h2>
          </div>
          <section className="post-content">
            <p className="post-text">
              <a href={topicPostUrl}><b>#{forum.topic}#</b></a>
              {Emoj.formatText(forum.content)}
            </p>
            <div className="photo">
              {imgs}
            </div>
          </section>
          <div className="address">
          {
            (() => {
              if (forum.addr !== '') {
                return <div><i className="icon icon-address s20"></i>{forum.addr}</div>;
              }
            })()
          }
          </div>
        </article>
      </section>
    )
  }

  render() {

    return (
      <section className="post-detail">
        {this._render()}

      </section>
    );
  }
}
