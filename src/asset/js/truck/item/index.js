import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

import {MiniReadableTime} from '../../bbs/readable-time/';

export default class TruckItem extends Component {
  constructor() {
    super();
  }

  render() {
    let props = this.props;
    let rTruckDetail = props.userWithLatLng;

    let truckLength = rTruckDetail.truckLength != null && parseFloat(rTruckDetail.truckLength) !== 0 ? `${rTruckDetail.truckLength}米`: '';
    let loadLimit = rTruckDetail.loadLimit != null && parseFloat(rTruckDetail.loadLimit) !== 0 ? `${rTruckDetail.loadLimit}吨` : '';
    let fromCities = rTruckDetail.fromCities.split(',');
    let toCities = rTruckDetail.toCities.split(',');

    let fromCitiesNum = fromCities.length > 1 ? <b>({fromCities.length})</b> : null;
    let toCitiesNum = toCities.length > 1 ? <b>({toCities.length})</b> : null;

    return (
      <div className="truck-item">
        <div className="title">
          <i className="flag teal">{rTruckDetail.truckTagStr}</i>
          <span>{fromCities[0]}</span>
          {fromCitiesNum}
          <i className="icon icon-target"></i>
          <span>{toCities[0]}</span>
          <b>{toCitiesNum}</b>
        </div>
        <div className="detail">
          <div className="row">
            <div className="truck-desc-col">
              <p className="truck-desc">{rTruckDetail.truckStatusMsg}</p>
            </div>
            {
              // <div className="recommend-col">
              //   <a href="#" className="recommend">
              //     <i className="flag orange">99 推荐 >></i>
              //   </a>
              // </div>
            }
          </div>
          <p><b>{rTruckDetail.licensePlate} {rTruckDetail.truckTypeStr} {truckLength} {loadLimit}</b></p>
        </div>
        <div className="extra">
          <ul className="actions">
            <li onClick={props.repub}><a href="#">重新发布</a></li>
            <li><a href={`./truck-detail.html?tid=${rTruckDetail.routeID}`}>详情</a></li>
            <li onClick={props.del}><a href="#">删除</a></li>
          </ul>
          <span>
            <MiniReadableTime time={rTruckDetail.orderByTime} />
            发布
          </span>
        </div>
      </div>
    );
  }
}
