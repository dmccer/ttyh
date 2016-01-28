import './index.less';

import React, {Component} from 'react';

export default class FixedHolder extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="fixed-holder" style={{
        height: `${this.props.height}px`
      }}></div>
    );
  }
}
