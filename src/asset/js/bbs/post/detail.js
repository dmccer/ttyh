import './item.less';

import React from 'react';
import classNames from 'classnames';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';

export default class PostDetailItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
      imgs: [],
      load: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_forum',
      type: 'GET',
      data: {
        id: this.props.fid,
        uid: this.state.qs.uid
      },
      success: (data) => {
        let forum;

        if (data && data.bbsForumList && data.bbsForumList.length) {
          forum = data.bbsForumList[0];

          forum.imgs = forum.imgs_url && forum.imgs_url.split(';') || [];

          this.setState(forum);
        }

        this.refs.loading.close();
        this.props.onLoadForum(forum);

        this.setState({
          load: true
        });
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  follow() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/mvc/follow_' + this.state.uid,
      type: 'GET',
      success: (data) => {
        this.refs.loading.close();
        this.refs.poptip.success('关注成功');

        this.fetch();
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }

        this.refs.loading.close();
        this.refs.poptip.success('关注失败');
      }
    });
  }

  del() {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/api/bbs/_del',
      type: 'POST',
      data: {
        uid: this.state.uid,
        token: this.state.qs.token,
        fid: this.props.fid
      },
      success: (data) => {
        this.refs.loading.close();

        this.refs.poptip.success('删除成功');

        setTimeout(() => {
          history.back();
        }, 3000);
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }

        this.refs.loading.close();
        this.refs.poptip.success('删除失败');
      }
    });
  }

  render_follow() {
    if (this.state.uid !== this.state.qs.uid) {
      if (this.state.follow === 1) {
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
          onClick={this.follow.bind(this)}>
          <i className="icon icon-plus"></i>
          <span><b>关注</b></span>
        </span>
      );
    } else {
      return (
        <span className="del" onClick={this.del.bind(this)}><i className="icon icon-del s20"></i>删除</span>
      );
    }
  }

  renderTIcon() {
    let ticons = []

    if (this.state.good === 1) {
      ticons.push(<i className="ticon jing teal" key="ticon-item-jing"></i>);
    }

    if (this.state.sort === 1) {
      ticons.push(<i className="ticon ding orange" key="ticon-item-ding"></i>);
    }

    if (this.state.uid == 25946) {
      ticons.push(<i className="ticon guan light-purple" key="ticon-item-guan"></i>);
    }

    return ticons;
  }

  _render() {
    if (!this.state.load) {
      return;
    }

    let imgs = this.state.imgs.map((img, index) => {
      return <a href="javascript:void(0)" key={'img-item_' + index}><img src={img} /></a>
    });

    let topicPostUrl = './topic-posts.html?' + querystring.stringify($.extend({}, this.state.qs, {
      tid: this.state.tid,
      topic: this.state.topic
    }));

    return (
      <section className="post-item">
        <header className="row">
          <div className="profile">
            <Avatar uid={this.state.uid} name={this.state.userName} url={this.state.imgUrl} size="s40" />
            <div className="poster">
              {this.state.userName}
              <i className="ticon louzhu light-purple"></i>
            </div>
            <div className="">
              {this.renderTIcon()}
              <ReadableTime time={this.state.create_time} />
            </div>
          </div>
          <div className="poster-actions">
            {this.render_follow()}
          </div>
        </header>
        <article className="post-body">
          <div className="post-title">
            <span className="browse-count">被浏览 <b>{this.state.bcount}</b> 次</span>
            <h2>{this.state.title}</h2>
          </div>
          <section className="post-content">
            <p className="post-text">
              <a href={topicPostUrl}><b>#{this.state.topic}#</b></a>
              {Emoj.formatText(this.state.content)}
            </p>
            <div className="photo">
              {imgs}
            </div>
          </section>
          <div className="address">
          {
            (() => {
              if (this.state.addr !== '') {
                return <div><i className="icon icon-address s20"></i>{this.state.addr}</div>;
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
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    );
  }
}
