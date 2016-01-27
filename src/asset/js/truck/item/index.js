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

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) !== 0 ? `${props.truckLength}米`: '';
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? `${props.loadLimit}吨` : '';
    let fromCities = props.fromCities.split(',');
    let toCities = props.toCities.split(',');

    let fromCitiesNum = fromCities.length > 1 ? <b>({fromCities.length})</b> : null;
    let toCitiesNum = toCities.length > 1 ? <b>({toCities.length})</b> : null;

    return (
      <div className="truck-item">
        <div className="title">
          <i className="flag teal">{props.truckTagStr}</i>
          <span>{fromCities[0]}</span>
          {fromCitiesNum}
          <i className="icon icon-target"></i>
          <span>{toCities[0]}</span>
          <b>{toCitiesNum}</b>
        </div>
        <div className="detail">
          <div className="row">
            <div className="truck-desc-col">
              <p className="truck-desc">{props.routeDescription}</p>
            </div>
            {
              // <div className="recommend-col">
              //   <a href="#" className="recommend">
              //     <i className="flag orange">99 推荐 >></i>
              //   </a>
              // </div>
            }
          </div>
          <p><b>{props.licensePlate} {props.truckTypeStr} {truckLength} {loadLimit}</b></p>
        </div>
        <div className="extra">
          <ul className="actions">
            <li onClick={props.repub}><a href="#">重新发布</a></li>
            <li><a href={`./truck-detail.html?tid=${props.routeID}`}>详情</a></li>
            <li onClick={props.del}><a href="#">删除</a></li>
          </ul>
          <span>
            <MiniReadableTime time={props.createTime} />
            发布
          </span>
        </div>
      </div>
    );
  }
}
