import './index.less';

import React from 'react';

export default class MiniTruckItem extends React.Component {
  constructor() {
    super();
  }

  render() {
    let props = this.props;
    let selected = props.isDefault === 0 ? <i className="icon s20 icon-item-selected"></i> : null;

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) !== 0 ? `${props.truckLength}米`: '';
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? `${props.loadLimit}吨` : '';

    return (
      <div className="mini-truck-item">
        <a href="#">
          <h3>{props.dirverName}</h3>
          <p>{props.licensePlate} {props.truckType} {truckLength} {loadLimit}</p>
          {selected}
        </a>
      </div>
    );
  }
}
