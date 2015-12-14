import './item.less';
import React from 'react';
import classNames from 'classnames';
import Loading from '../../loading/';

export default class PostDetailItem extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/mvc/bbs_v2/show_forum',
      type: 'GET',
      data: {
        id: this.props.fid,
        uid: null
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          let forum = data.bbsForumList[0];

          forum.imgs = forum.imgs_url && forum.imgs_url.split(';') || [];

          this.setState(forum);
        }

        this.refs.loading.close();
      }
    })
  }

  render() {
    let imgs = this.state.imgs
      ? <a href={this.state.imgs[0]}><img src={this.state.imgs[0]} /></a>
      : '';

    return (
      <section className="post-item post-detail" key={'post-detail_' + this.state.id}>
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.state.imgUrl}></img>
            <div className="poster">{this.state.userName}<i className={classNames('flag', this.state.mine ? '' : 'hide')}>楼主</i></div>
            <div className="post-time"><i className="icon icon-clock"></i>{new Date(this.state.create_time).toLocaleDateString().substring(5).replace('/', '-')}</div>
          </div>
          <div className="poster-actions">
            {
              (() => {
                if (!this.state.user.mine) {
                  if (this.state.followed) {
                    return <span className={classNames('followed', this.state.followed ? '' : 'hide')}><i className="icon icon-correct"></i>已关注</span>;
                  }

                  return <span className={classNames('follow', this.state.followed ? 'hide' : '')}><i className="icon icon-plus"></i>关注</span>;
                } else {
                  return <span className="del"><i className="icon icon-del"></i>删除</span>;
                }
              })()
            }
          </div>
        </header>
        <article className="post-body">
          <div className="post-title">
            <span className="browse-count">被浏览 <b>{this.state.bcount}</b> 次</span>
            <h2>{this.state.title}</h2>
          </div>
          <section className="post-content">
            <p className="post-text"><b>#{this.state.title}#</b>{this.state.content}</p>
            <div className="photo">
              {imgs}
            </div>
          </section>
          <div className="address"><i className="icon icon-address"></i>{this.state.addr}</div>
        </article>
        <Loading ref='loading' />
      </section>
    );
  }
}
