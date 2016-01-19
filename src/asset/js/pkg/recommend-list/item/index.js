import '../../../../less/global/global.less';
import '../../../../less/global/layout.less';
import '../../../../less/component/icon.less';
import '../../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';


export default class RecommendPkgItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="pkg-item">
        <div className="row">
          <div className="account">
            <div className="avatar">
              <a href="#" style={{
                backgroundImage: 'url(http://imgsize.ph.126.net/?imgurl=http://img2.ph.126.net/Bxuv7RNkBKTwug5oISbHZw==/6631311857283249341.jpg_188x188x1.jpg)',
                backgroundSize: 'cover'
              }}></a>
            </div>
            <div className="nick-name">如意</div>
            <div className="certified-tags">
              <i className="certified-tag flag teal off">实</i>
              <i className="certified-tag flag orange">公</i>
            </div>
          </div>
          <div className="pkg">
            <div className="title">
              <span>上海市-浦东新区</span>
              <i className="icon icon-target"></i>
              <span>北京市-海淀区</span>
            </div>
            <div className="detail">
              <p className="pkg-desc">
                <i className="icon icon-pkg-type s18"></i>
                <span>冰激凌</span>
                <span>10吨</span>
                <span>5方</span>
              </p>
              <p className="truck-desc">
                <i className="flag teal">需</i>
                <span>7米</span>
                <span>冷藏车</span>
              </p>
              <p className="memo">的沙发的沙发ijossddsf的撒范德萨发生的，是大方的说法第三方</p>
              <p className="extra">
                <span>1271.1公里</span>
                <span className="divider">|</span>
                <span>2小时前</span>
              </p>
            </div>
          </div>
          <div className="tel">
            <a href="tel:15601859828" className="icon icon-call s30"></a>
          </div>
        </div>
        <div className="tag unread">未读</div>
      </div>
    );
  }
}
