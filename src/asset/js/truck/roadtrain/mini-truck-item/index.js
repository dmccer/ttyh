import './index.less';

import React from 'react';

export default class MiniTruckItem extends React.Component {
  constructor() {
    super();
  }

  remove() {
    if (confirm('是否删除该车?')) {
      this.props.del(this.props.truckID);
    }
  }

  render() {
    let props = this.props;
    let selected = props.isDefault === 1 ? <i className="icon s20 icon-item-selected"></i> : null;

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) !== 0 ? `${props.truckLength}米`: '';
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? `${props.loadLimit}吨` : '';

    return (
      <div className="mini-truck-item" onClick={props.select}>
        <a href="#">
          <h3>
            <span>{props.dirverName || '佚名'}</span>
            {selected}
          </h3>
          <p>{props.licensePlate} {props.truckType} {truckLength} {loadLimit}</p>
          <i className="icon icon-del s20 off" onClick={this.remove.bind(this)}></i>
        </a>
      </div>
    );
  }
}
