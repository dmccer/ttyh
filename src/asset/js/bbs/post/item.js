import './item.less';
import React from 'react';

import FullscreenImg from '../../fullscreen-img/';

export default class PostItem extends React.Component {
  constructor() {
    super();

    this.state = {}
  }

  handleClickItem(post) {
    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?id=' + post.id);
  }

  handleShowPic(img: Object, e) {
    e.preventDefault();
    e.stopPropagation();
    
    let largeImgs = this.props.item.imgs.map((item) => {
      return img.large;
    });

    this.setState({
      currentFullscreenImg: img.large,
      fullscreeImgs: largeImgs
    });
  }

  render() {
    let imgs = this.props.item.imgs.map((item, index) => {
      if (index === 2) {
        let imgCount = <span className="photo-tip">共{this.props.item.imgs.length}张</span>;
        return (
          <li
            key={'img_' + index}
            onClick={this.handleShowPic.bind(this, item)}>
            <a href={item.large}>
              <img src={item.thumbnail} />
            </a>
            {imgCount}
          </li>
        );
      }

      return (
        <li
          key={'img_' + index}
          onClick={this.handleShowPic.bind(this, item)}>
          <a href={item.large}>
            <img src={item.thumbnail} />
          </a>
        </li>
      );
    });

    if (imgs.length > 3) {
      imgs.splice(3, this.props.item.imgs.length - 3);
    }

    let fullscreeImgs = this.state.fullscreeImgs && this.state.fullscreeImgs.length
      ? <FullscreenImg
        images={this.state.fullscreeImgs}
        on={this.state.currentFullscreenImg} />
      : null;

    return (
      <li className="post-item" onClick={this.handleClickItem.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.user.avatar} />
            <div className="poster">{this.props.item.user.nickname}</div>
            <div className="post-time"><i className="icon icon-clock"></i>{this.props.item.time}</div>
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit"></i>{this.props.item.comment_count}</span>
            <span><i className="icon icon-praise"></i>{this.props.item.praise_count}</span>
          </div>
        </header>
        <article className="post-body">
          <h2>{this.props.item.title}</h2>
          <section className="post-content">
            <p className="post-text"><b>#{this.props.item.title}#</b>{this.props.item.text}</p>
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
