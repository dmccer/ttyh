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
import JWeiXin from '../../../jweixin/';

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

  hanldleMakeCall(tel, e) {
    e.preventDefault();
    e.stopPropagation();

    _hmt.push(['_trackEvent', '车源', '列表打电话', this.props.userWithLatLng.mobileNo || '']);

    this.props.verifyTip(tel);
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
    let toCitiesNum = toCities && toCities.length > 1 ? <b>({toCities.length})</b> : null;


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

    let tel = JWeiXin.isWeixinBrowser() ? null : <p className="tel-text">电话联系: {truck.mobileNo}</p>;
    let telLink = JWeiXin.isWeixinBrowser() ? (
      <div className="tel">
        <a onClick={this.hanldleMakeCall.bind(this, truck.mobileNo)} ref="tel" href={`tel:${truck.mobileNo}`} className="icon icon-call s30"></a>
      </div>
    ) : null;

    return (
      <div className="truck-item" onClick={this.detail.bind(this)}>
        <div className="row">
          <div className="account">
            <Avatar img={truck.faceImgUrl} />
            <div className="nick-name">{truck.userName && truck.userName.substring(0, 4) || '佚名'}</div>
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
              {tel}
              <p className="extra">
                {
                  // <span>1271.1公里</span>
                  // <span className="divider">|</span>
                }
                <MiniReadableTime time={truck.orderByTime} />
              </p>
            </div>
          </div>
          {telLink}
        </div>
      </div>
    );
  }
}
