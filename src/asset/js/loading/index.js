import './index.less';
import '../../less/component/icon.less';

import React from 'react';
import cx from 'classnames';

export default class Loading extends React.Component {
  constructor() {
    super();

    this.state = {
      on: false,
      timeout: 3000
    };
  }

  toggle(msg: string, timeout=3000: number) {
    this.setState({
      msg: msg,
      timeout: timeout || 3000,
      on: true
    });

    setTimeout(() => {
      this.setState({
        on: false
      });
    }, this.state.timeout)
  }

  show(msg: string) {
    this.setState({
      on: true,
      msg: msg
    });
  }

  close() {
    this.setState({
      on: false
    });
  }

  render() {
    let loadingClassNames = cx('loading', this.state.on ? 'on' : '');

    return this.state.on ? (
      <div className={loadingClassNames}>
        <div className="mask"></div>
        <div className="loading-panel">
          <p className="loading-text">
            <i className="icon icon-loading"></i>
            <span>{this.state.msg}</span>
          </p>
        </div>
      </div>
    ) : null;
  }
}
