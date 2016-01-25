import '../../../less/global/global.less';
import '../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';

export default class PkgItemDesc extends Component {
  constructor() {
    super();
  }

  renderPkgDesc() {
    let props = this.props;

    let pkgType = props.title != null ? <span>{props.title}</span> : null;
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? <span>{props.loadLimit}吨</span> : null;

    if (pkgType == null && loadLimit == null) {
      return;
    }

    return (
      <p className="pkg-desc">
        <i className="icon icon-pkg-type s18"></i>
        {pkgType}
        {loadLimit}
      </p>
    );
  }

  renderTruckDesc() {
    let props = this.props;

    let truckLength = props.truckLength != null && parseFloat(props.truckLength) ? <span>{props.truckLength}米</span> : null;
    let truckType = props.truckType != null && parseFloat(props.truckType) ? <span>{props.truckType}</span> : null;

    if (truckLength == null && truckType == null) {
      return;
    }

    return (
      <p className="truck-desc">
        <i className="flag teal">需</i>
        {truckLength}
        {truckType}
      </p>
    );
  }

  render() {
    return (
      <div className="pkg-item-desc">
        {this.renderPkgDesc()}
        {this.renderTruckDesc()}
      </div>
    );
  }
}
