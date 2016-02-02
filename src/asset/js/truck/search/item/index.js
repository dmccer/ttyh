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

    location.href = `./truck-detail.html?tid=${this.props.userWithLatLng.routeID}`;
  }

  hanldleMakeCall() {
    _hmt.push(['_trackEvent', '车源', '列表打电话', this.props.userWithLatLng.mobileNo || '']);
  }

  renderLine() {
    let props = this.props;
    let truck = props.userWithLatLng;

    let truckTag = truck.truckTagStr ? <i className="flag teal">{truck.truckTagStr}</i> : null;
    let fromCities = truck.fromCities ? truck.fromCities.split(',') : null;
    let toCities = truck.toCities ? truck.toCities.split(',') : null;

    let fromCity = fromCities && fromCities[0] || '暂无';
    let toCity = toCities && toCities[0] || '暂无';

    let fromCitiesNum = fromCities && fromCities.length > 1 ? <b>({fromCities.length})</b> : null;
    let toCitiesNum = fromCities && toCities.length > 1 ? <b>({toCities.length})</b> : null;


    return (
      <div className="title">
        {truckTag}
        <span>{fromCity}</span>
        {fromCitiesNum}
        <i className="icon icon-target"></i>
        <span>{toCity}</span>
        <b>{toCitiesNum}</b>
      </div>
    );
  }

  render() {
    let props = this.props;
    let truck = props.userWithLatLng;

    let truckLength = truck.truckLength != null && parseFloat(truck.truckLength) !== 0 ? `${truck.truckLength}米`: '';
    let loadLimit = truck.loadLimit != null && parseFloat(truck.loadLimit) !== 0 ? `${truck.loadLimit}吨` : '';

    return (
      <div className="truck-item" onTouchTap={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={truck.faceImgUrl} />
            <div className="nick-name">{truck.userName && truck.userName.substring(0, 4)}</div>
            <div className="certified-tags">
              <AccountCertifyStatus
                type='trucker'
                realNameCertified={truck.sfzVerify}
                driverCertified={truck.driverVerify}
              />
            </div>
          </div>
          <div className="truck">
            {this.renderLine()}
            <div className="detail">
              <p className="memo">{truck.truckStatusMsg}</p>
              <p className="truck-desc"><b>{truck.licensePlate} {truck.truckTypeStr} {truckLength} {loadLimit}</b></p>
              <p className="extra">
                {
                  // <span>1271.1公里</span>
                  // <span className="divider">|</span>
                }
                <MiniReadableTime time={truck.orderByTime} />
              </p>
            </div>
          </div>
          <div className="tel">
            <a onClick={this.hanldleMakeCall.bind(this)} ref="tel" href={`tel:${truck.mobileNo}`} className="icon icon-call s30"></a>
          </div>
        </div>
      </div>
    );
  }
}
