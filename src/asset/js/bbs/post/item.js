import './item.less';
import React from 'react';

import FullscreenImg from '../../fullscreen-img/';
import querystring from 'querystring';

export default class PostItem extends React.Component {
  constructor() {
    super();

    this.state = {}
  }

  handleClickItem(post) {
    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + querystring.stringify({ id: post.id, tid: post.tid }));
  }

  handleShowPic(img: string, e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      currentFullscreenImg: this.props.item.imgs.indexOf(img),
      fullscreeImgs: this.props.item.imgs
    });
  }

  closeFullscrrenImg() {
    this.setState({
      fullscreeImgs: null,
      currentFullscreenImg: null
    });
  }

  render() {
    let imgs;

    if (this.props.item.imgs && this.props.item.imgs.length) {
      imgs = this.props.item.imgs.map((item, index) => {
        if (index === 2) {
          let imgCount = <span className="photo-tip">共{this.props.item.imgs.length}张</span>;
          return (
            <li
              key={'img_' + index}
              onClick={this.handleShowPic.bind(this, item)}>
              <a href={item}>
                <img src={item} />
              </a>
              {imgCount}
            </li>
          );
        }

        return (
          <li
            key={'img_' + index}
            onClick={this.handleShowPic.bind(this, item)}>
            <a href={item}>
              <img src={item} />
            </a>
          </li>
        );
      });
    }

    if (imgs && imgs.length > 3) {
      imgs.splice(3, this.props.item.imgs.length - 3);
    }

    let fullscreeImgs = this.state.fullscreeImgs && this.state.fullscreeImgs.length
      ? <FullscreenImg
        images={this.state.fullscreeImgs}
        on={this.state.currentFullscreenImg}
        onClose={this.closeFullscrrenImg.bind(this)} />
      : null;

    // <img className="avatar" src={this.props.item.user.avatar} />
    // <div className="poster">{this.props.item.user.nickname}</div>
    return (
      <li className="post-item" onClick={this.handleClickItem.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">

            <div className="post-time"><i className="icon icon-clock"></i>{new Date(this.props.item.create_time).toLocaleDateString().substring(5).replace('/', '-')}</div>
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit"></i>{this.props.item.rcount}</span>
            <span><i className="icon icon-praise"></i>{this.props.item.pcount}</span>
          </div>
        </header>
        <article className="post-body">
          <h2>{this.props.item.title}</h2>
          <section className="post-content">
            <p className="post-text"><b>#{this.props.item.title}#</b>{this.props.item.content}</p>
            <ul className="post-photos">
              {imgs}
            </ul>
            {fullscreeImgs}
          </section>
        </article>
      </li>
    );
  }
}
