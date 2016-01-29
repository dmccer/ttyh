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

  hanldleMakeCall() {
    _hmt.push(['_trackEvent', '车源', '列表打电话', this.props.driverPoneNo]);
  }

  render() {
    let props = this.props;
    let truck = props.userWithLatLng;

    let truckLength = truck.truckLength != null && parseFloat(truck.truckLength) !== 0 ? `${truck.truckLength}米`: '';
    let loadLimit = truck.loadLimit != null && parseFloat(truck.loadLimit) !== 0 ? `${truck.loadLimit}吨` : '';
    let fromCities = (truck.fromCities || '').split(',');
    let toCities = (truck.toCities || '').split(',');

    let fromCitiesNum = fromCities.length > 1 ? <b>({fromCities.length})</b> : null;
    let toCitiesNum = toCities.length > 1 ? <b>({toCities.length})</b> : null;

    return (
      <div className="truck-item" onClick={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={truck.faceImgUrl} />
            <div className="nick-name">{truck.userName}</div>
            <div className="certified-tags">
              <AccountCertifyStatus
                type='trucker'
                realNameCertified={truck.sfzVerify}
                driverCertified={truck.driverVerify}
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
            <a onClick={this.hanldleMakeCall.bind(this)} ref="tel" href={`tel:${props.driverPoneNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
