import './index.less';

import React from 'react';

export default class MiniTruckItem extends React.Component {
  constructor() {
    super();
  }

  render() {
    let props = this.props;
    let selected = props.default ? <i className="icon s20 icon-item-selected"></i> : null;

    return (
      <div className="mini-truck-item">
        <a href="#">
          <h3>{props.truck_owner}</h3>
          <p>{props.license} {props.truck_type} {props.truck_length} {props.load}</p>
          {selected}
        </a>
      </div>
    );
  }
}
