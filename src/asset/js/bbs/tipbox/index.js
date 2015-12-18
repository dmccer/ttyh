import './index.less';

import React from 'react';
import classNames from 'classnames';

/**
 * <TipBox msg={this.state.submitMsg} ok={this.state.submitOk} onClose={this.handleTipBoxClosed.bind(this)} />
 */
export default class TipBox extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.onClose();
    }, 3000);
  }

  render() {
    var cls = classNames('icon', 'icon-' + (this.props.ok ? 'ok' : 'fail'));

    return (
      <div className="tipbox">
        <div className="mask" onClick={this.props.onClose}></div>
        <div className="tip-panel">
          <p className="tip-text">{this.props.msg}</p>
          <i className={cls}></i>
        </div>
      </div>
    )
  }
}
