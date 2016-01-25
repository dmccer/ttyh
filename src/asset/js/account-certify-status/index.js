import '../../less/component/flag.less';
import './index.less';

import React from 'react';
import classNames from 'classnames';

export default class AccountCertifyStatus extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="certified-tags">
        <i className="certified-tag flag teal off">实</i>
        <i className="certified-tag flag orange">公</i>
      </div>
    );
  }
}
