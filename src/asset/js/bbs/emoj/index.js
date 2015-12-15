import '../../../less/global/layout.less';
import './index.less';

import React from 'react';

export default class Emoj extends React.Component {
  constructor() {
    super();

    this.state = {
      emojIconSize: 24,
      emojIconPadding: 10,
      emojCountPerLine: 6
    };
  }

  pos(code: Number) {
    let _x = code % this.state.emojCountPerLine;
    let _y = Math.floor(code / this.state.emojCountPerLine);

    let x = _x * (this.state.emojIconSize + this.state.emojIconPadding);
    let y = _y * (this.state.emojIconSize + this.state.emojIconPadding);

    return {
      x: -x,
      y: -y
    };
  }

  render() {
    let pos = this.pos(this.props.code);

    let emojStyle = {
      'backgroundImage': `url('./img/qq/emoj.png')`,
      'backgroundPosition': `${pos.x}px ${pos.y}px`
    }

    return (
      <i className="emoj-icon" style={emojStyle}></i>
    );
  }
}
