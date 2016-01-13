import './index.less';

import React from 'react';
import cx from 'classnames';

/**
 * Mask
 *
 * type {string} 可选值: black, white, none, 默认 none
 */
export default class Mask extends React.Component {
  constructor() {
    super();
  }

  render() {
    let cxs = cx('mask', this.props.type || 'none');

    return (
      <div className={cxs} onClick={this.props.click}></div>
    );
  }
}
