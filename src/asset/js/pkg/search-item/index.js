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

  render() {
    let props = this.props;

    return (
      <div className="pkg-item" onClick={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={props.provideUserImgUrl} />
            <div className="nick-name">{props.providerUserName}</div>
            <AccountCertifyStatus />
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
                <span>1271.1公里</span>
                <span className="divider">|</span>
                <span>2小时前</span>
              </p>
            </div>
          </div>
          <div className="tel">
            <a ref="tel" href={`tel:${props.product.provideUserMobileNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
