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

    let pkgName = props.title != null ? <span>{props.title}</span> : null;
    let loadLimit = props.loadLimit != null && parseFloat(props.loadLimit) !== 0 ? <span>{props.loadLimit}吨</span> : null;
    let pack = <span>{props.packTypeStr}{props.productCount ? ` * ${props.productCount}` : ''}</span>;

    return (
      <p className="pkg-desc">
        <i className="icon icon-pkg-type s18"></i>
        {pkgName}
        {loadLimit}
        {pack}
      </p>
    );
  }

  renderTruckDesc() {
    let props = this.props;

    let useType = props.useType != null && parseInt(props.useType) ? <span>{props.useTypeStr}</span> : null;
    let truckLength = props.truckLength != null && parseFloat(props.truckLength) ? <span>{props.truckLength}米</span> : null;
    let truckType = props.truckType != null && parseInt(props.truckType) ? <span>{props.truckTypeStr}</span> : null;
    let stallSize = props.spaceNeeded != null && parseFloat(props.spaceNeeded) ? <span>占用{props.spaceNeeded}米</span> : null;
    if (truckLength == null && truckType == null) {
      return;
    }

    return (
      <p className="truck-desc">
        <i className="flag teal">需</i>
        {useType}
        {truckType}
        {truckLength}
        {stallSize}
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
