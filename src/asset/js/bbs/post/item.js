import './item.less';
import React from 'react';

import FullscreenImg from '../../fullscreen-img/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';

export default class PostItem extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  handleClickItem(post) {
    const qs = querystring.stringify($.extend({}, this.state.qs, {
      fid: post.id,
      tid: post.tid
    }));

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs-detail.html?' + qs);
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

  renderImgs() {
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

    return imgs;
  }

  renderFullscreenImgs() {
    let fullscreeImgs = this.state.fullscreeImgs && this.state.fullscreeImgs.length
      ? <FullscreenImg
        images={this.state.fullscreeImgs}
        on={this.state.currentFullscreenImg}
        onClose={this.closeFullscrrenImg.bind(this)} />
      : null;

    return fullscreeImgs;
  }

  render() {
    return (
      <li className="post-item" onClick={this.handleClickItem.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.imgUrl} />
            <div className="poster">{this.props.item.userName}</div>
            <ReadableTime time={this.props.item.create_time} />
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit"></i>{this.props.item.rcount}</span>
            <span><i className="icon icon-praise"></i>{this.props.item.pcount}</span>
          </div>
        </header>
        <article className="post-body">
          <h2>{this.props.item.title}</h2>
          <section className="post-content">
            <p className="post-text">
              <b>#{this.props.item.title}#</b>
              {Emoj.formatText(this.props.item.content)}
            </p>
            <ul className="post-photos">
              {this.renderImgs()}
            </ul>
            {this.renderFullscreenImgs()}
          </section>
        </article>
      </li>
    );
  }
}
