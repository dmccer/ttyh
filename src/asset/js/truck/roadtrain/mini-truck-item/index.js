import './index.less';

import React from 'react';

export default class MiniTruckItem extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="mini-truck-item">
        <a href="#">
          <h3>吉祥</h3>
          <p>AU8998 厢式 3.3米 2吨</p>
          <i className="icon s20 icon-item-selected"></i>
        </a>
      </div>
    );
  }
}
