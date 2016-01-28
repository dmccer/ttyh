/**
 * 找货列表项
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../../less/global/global.less';
import '../../../../less/component/icon.less';
import '../../../../less/global/layout.less';
import '../../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';
import Avatar from '../../../avatar/';
import AccountCertifyStatus from '../../../account-certify-status/';
import {MiniReadableTime} from '../../../bbs/readable-time/';

export default class SearchItem extends Component {
  constructor() {
    super();
  }

  detail(e) {
    if (e.target === this.refs.tel) {
      return;
    }

    location.href = `./truck-detail.html?tid=${this.props.truckID}`;
  }

  render() {
    let props = this.props;

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) !== 0 ? `${props.truckLength}米`: '';
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? `${props.loadLimit}吨` : '';
    let fromCities = props.fromCities.split(',');
    let toCities = props.toCities.split(',');

    let fromCitiesNum = fromCities.length > 1 ? <b>({fromCities.length})</b> : null;
    let toCitiesNum = toCities.length > 1 ? <b>({toCities.length})</b> : null;

    return (
      <div className="truck-item" onClick={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={props.provideUserImgUrl} />
            <div className="nick-name">{props.providerUserName}</div>
            <div className="certified-tags">
              <AccountCertifyStatus
                type='trucker'
                realNameCertified={props.provideUserSfzVerify}
                driverCertified={props.provideUserDriverVerify}
              />
            </div>
          </div>
          <div className="truck">
            <div className="title">
              <i className="flag teal">{props.truckTagStr}</i>
              <span>{fromCities[0]}</span>
              {fromCitiesNum}
              <i className="icon icon-target"></i>
              <span>{toCities[0]}</span>
              <b>{toCitiesNum}</b>
            </div>
            <div className="detail">
              <p><b>{props.licensePlate} {props.truckTypeStr} {truckLength} {loadLimit}</b></p>
              <p className="extra">
                {
                  // <span>1271.1公里</span>
                  // <span className="divider">|</span>
                }
                <MiniReadableTime time={props.createTime} />
              </p>
            </div>
          </div>
          <div className="tel">
            <a ref="tel" href={`tel:${props.dirverPoneNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
