/**
 * 找货列表项
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/component/icon.less';
import '../../../less/global/layout.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

import Avatar from '../../avatar/';
import AccountCertifyStatus from '../../account-certify-status/';
import PkgItemDesc from '../item-desc/';
import {MiniReadableTime} from '../../bbs/readable-time/';


export default class SearchItem extends Component {
  constructor() {
    super();
  }

  detail(e) {
    if (e.target === this.refs.tel) {
      return;
    }

    location.href = `./pkg-detail.html?pid=${this.props.product.productID}`;
  }

  hanldleMakeCall() {
    _hmt.push(['_trackEvent', '货源', '列表打电话', this.props.product.provideUserMobileNo || '']);
  }

  render() {
    let props = this.props;

    return (
      <div className="pkg-item" onTouchTap={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={props.provideUserImgUrl} />
            <div className="nick-name">{props.providerUserName && props.providerUserName.substring(0, 4)}</div>
            <div className="certified-tags">
              <AccountCertifyStatus
                type='shipper'
                realNameCertified={props.provideUserSfzVerify}
                companyCertified={props.provideUserCompanyVerify}
              />
            </div>
          </div>
          <div className="pkg">
            <div className="title">
              <span>{props.product.fromCity.replace(' ', '-')}</span>
              <i className="icon icon-target"></i>
              <span>{props.product.toCity.replace(' ', '-')}</span>
            </div>
            <div className="detail">
              <PkgItemDesc {...props.product} />
              <p className="memo">{props.product.memo}</p>
              <p className="extra">
                {
                  // <span>1271.1公里</span>
                  // <span className="divider">|</span>
                }
                <MiniReadableTime time={props.product.createTime} />
              </p>
            </div>
          </div>
          <div className="tel">
            <a onClick={this.hanldleMakeCall.bind(this)} ref="tel" href={`tel:${props.product.provideUserMobileNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
