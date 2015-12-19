import './item.less';
import React from 'react';
import classNames from 'classnames';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';

export default class PostDetailItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
      imgs: []
    };
  }

  componentDidMount() {
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
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  follow() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/follow_' + this.state.uid,
      type: 'GET',
      success: (data) => {
        this.refs.loading.close();

        this.refs.poptip.success('关注成功');
      },
      error: () => {
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
      error: () => {
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

  render() {
    let imgs = this.state.imgs.map((img, index) => {
      return <a href="javascript:void(0)" key={'img-item_' + index}><img src={img} /></a>
    });

    return (
      <section className="post-item post-detail" key={'post-detail_' + this.state.id}>
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.state.imgUrl}></img>
            <div className="poster">{this.state.userName}<i className={classNames('flag', this.state.mine ? '' : 'hide')}>楼主</i></div>
            <ReadableTime time={this.state.create_time} />
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
            <p className="post-text"><b>#{this.state.title}#</b>{Emoj.formatText(this.state.content)}</p>
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
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    );
  }
}
