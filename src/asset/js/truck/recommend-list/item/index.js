import '../../../../less/global/global.less';
import '../../../../less/global/layout.less';
import '../../../../less/component/icon.less';
import '../../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

export default class RecommendTruckItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="truck-item">
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
          <div className="truck">
            <div className="title">
              <i className="flag teal">顺风车</i>
              <span>浦东新区</span>
              <b>(5)</b>
              <i className="icon icon-target"></i>
              <span>海淀区</span>
              <b>(3)</b>
            </div>
            <div className="detail">
              <p className="truck-desc">上海到哪里的货，天天有货为您服务，长期合作请联系我们</p>
              <p><b>AU8998 厢式 3.3米 2.9吨</b></p>
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
