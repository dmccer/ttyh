import './index.less';

import React from 'react';
import emojPNG from '../../../img/qq/emoj.png';

export default class Emoj extends React.Component {
  static code_reg() {
    return /\[\/f(\d+)\]/g;
  }

  constructor() {
    super();

    this.state = {
      emojIconSize: 24,
      emojIconPadding: 10,
      emojCountPerLine: 6
    };
  }

  static formatText(text: string) {
    let cnt = text;

    if ($.trim(cnt) === '') {
      return;
    }

    let m = cnt.match(Emoj.code_reg());

    if (!m) {
      return cnt;
    }

    let r = [];

    m.forEach((s, i) => {
      let si = cnt.indexOf(s);

      let code = parseInt(s.match(/\d+/)[0], 10);

      if (si === 0) {
        cnt = cnt.substring(0, s.length);
        r.push(<Emoj key={'emoj-text-item_' + r.length} code={code} />)

        return;
      }

      let t = cnt.substring(0, si);
      cnt = cnt.substring(0, t.length);

      r.push(<span key={'emoj-text-item_' + r.length}>{t}</span>);
      r.push(<Emoj key={'emoj-text-item_' + r.length} code={code} />)
    });

    return <span>{r}</span>;
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
      'backgroundImage': `url(${emojPNG})`,
      'backgroundPosition': `${pos.x}px ${pos.y}px`
    }

    return (
      <i className="emoj-icon" style={emojStyle}></i>
    );
  }
}
