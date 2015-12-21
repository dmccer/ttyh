import './item.less';
import React from 'react';

import FullscreenImg from '../../fullscreen-img/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';

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
    let topicPostUrl = './topic-posts.html?' + querystring.stringify($.extend({}, this.state.qs, {
      tid: this.props.item.tid
    }));

    return (
      <li className="post-item" onClick={this.handleClickItem.bind(this, this.props.item)}>
        <header className="row">
          <div className="profile">
            <Avatar uid={this.props.item.uid} url={this.props.item.imgUrl} size="s40" />
            <div className="poster">{this.props.item.userName}</div>
            <ReadableTime time={this.props.item.create_time} />
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit s15 disable"></i>{this.props.item.rcount}</span>
            <span><i className="icon icon-praise s15 disable"></i>{this.props.item.pcount}</span>
          </div>
        </header>
        <article className="post-body">
          <h2>{this.props.item.title}</h2>
          <section className="post-content">
            <p className="post-text">
              <a href={topicPostUrl}><b>#{this.props.item.topic}#</b></a>
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
