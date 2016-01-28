import '../../less/component/flag.less';
import './index.less';

import React from 'react';
import cx from 'classnames';

export default class AccountCertifyStatus extends React.Component {

  static defaultProps = {
    realNameCertified: false,
    companyCertified: false,
    driverCertified: false
  };

  constructor() {
    super();
  }

  render() {
    let props = this.props;

    if (!props.type) {
      throw new Error('AccountCertifyStatus Component props 缺少 type 参数');
    }

    if (props.type === 'shipper') {
      return (
        <span className="certified-tag-group">
          <i className={cx('certified-tag flag purple', !props.realNameCertified && 'off' || '')}>实</i>
          <i className={cx('certified-tag flag blue', !props.companyCertified && 'off' || '')}>公</i>
        </span>
      );
    }

    if (props.type === 'trucker') {
      return (
        <span className="certified-tag-group">
          <i className={cx('certified-tag flag purple', !props.realNameCertified && 'off' || '')}>实</i>
          <i className={cx('certified-tag flag green', !props.driverCertified && 'off' || '')}>车</i>
        </span>
      );
    }
  }
}
