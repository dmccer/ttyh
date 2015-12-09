import './item.less';
import React from 'react';
import classNames from 'classnames';

export default class PostDetailItem extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/mvc/bbs/show_forum',
      type: 'GET',
      data: {
        id: this.props.id,
        uid: null
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          data.bbsForumList[0].imgs = data.bbsForumList[0].imgs_url.split(';');

          this.setState(data.bbsForumList[0]);
        }
      }
    })
  }

  render() {
    let imgs = this.state.imgs
      ? <a href={this.state.imgs[0]}><img src={this.state.imgs[0]} /></a>
      : '';

    // <img className="avatar" src={this.state.user.avatar}></img>
    // <div className="poster">{this.state.user.nickname}<i className={classNames('flag', this.state.mine ? '' : 'hide')}>楼主</i></div>

    return (
      <section className="post-item post-detail" key={'post-detail_' + this.state.id}>
        <header className="row">
          <div className="profile">

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
            <h2>{this.state.title}</h2>
            <span className="browse-count">被浏览 <b>{this.state.bcount}</b> 次</span>
          </div>
          <section className="post-content">
            <p className="post-text"><b>#{this.state.title}#</b>{this.state.content}</p>
            <div className="photo">
              {imgs}
            </div>
          </section>
          <div className="address"><i className="icon icon-address"></i>{this.state.addr}</div>
        </article>
      </section>
    );
  }
}
