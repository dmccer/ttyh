import './index.less';

import React from 'react';
import Detect from '../../../helper/detect';

export default class MiniTruckItem extends React.Component {
  constructor() {
    super();
  }

  remove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('是否删除该车?')) {
      this.props.del(this.props.truckID);
    }
  }

  render() {
    let props = this.props;
    let selected = props.isDefault === 1 ? <i className="icon s20 icon-item-selected"></i> : null;

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) !== 0 ? `${props.truckLength}米`: '';
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? `${props.loadLimit}吨` : '';

    let commonRoute = props.fromcity && props.tocity ? (
      <div className="common-route">
        <span>{props.fromcity}</span>
        <i className="icon icon-target"></i>
        <span>{props.tocity}</span>
        <span className="extra-desc">(常跑路线)</span>
      </div>
    ) : null;

    let tel = Detect.isWeiXin() ? null : <p className="tel-text">电话联系: {props.dirverPoneNo}</p>;

    return (
      <div className="mini-truck-item" onClick={props.select}>
        <h3>
          <span>{props.dirverName || '佚名'}</span>
          {selected}
        </h3>
        <i className="icon icon-del s20 off" onClick={this.remove.bind(this)}></i>
        <p>{props.licensePlate} {props.truckType} {truckLength} {loadLimit}</p>
        {commonRoute}
        <div className="memo">{props.memo}</div>
        {tel}
      </div>
    );
  }
}
