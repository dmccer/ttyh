/**
 * 找货列表项
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

export default class SearchPkgItem extends Component {
  constructor() {
    super();
  }

  render() {
    let props = this.props;

    return (
      <div className="pkg-item">
        <div className="row">
          <div className="account">
            <div className="avatar">
              <a href="#" style={{
                backgroundImage: `url(${props.provideUserImgUrl})`,
                backgroundSize: 'cover'
              }}></a>
            </div>
            <div className="nick-name">{props.providerUserName}</div>
            <div className="certified-tags">
              <i className="certified-tag flag teal off">实</i>
              <i className="certified-tag flag orange">公</i>
            </div>
          </div>
          <div className="pkg">
            <div className="title">
              <span>{props.product.fromCity.replace(' ', '-')}</span>
              <i className="icon icon-target"></i>
              <span>{props.product.toCity.replace(' ', '-')}</span>
            </div>
            <div className="detail">
              <p className="pkg-desc">
                <i className="icon icon-pkg-type s18"></i>
                <span>{props.product.title}</span>
                <span>{props.product.loadLimit}吨</span>
              </p>
              <p className="truck-desc">
                <i className="flag teal">需</i>
                <span>{props.product.truckLength}米</span>
                <span>{props.product.truckType}</span>
              </p>
              <p className="memo">{props.product.memo}</p>
              <p className="extra">
                <span>1271.1公里</span>
                <span className="divider">|</span>
                <span>2小时前</span>
              </p>
            </div>
          </div>
          <div className="tel">
            <a href={`tel:${props.product.provideUserMobileNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
