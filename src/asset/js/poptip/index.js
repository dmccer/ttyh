import './index.less';

import React from 'react';
import classNames from 'classnames';

export default class Poptip extends React.Component {
  constructor() {
    super();

    this.state = {
      tips: []
    };
  }

  show(type: string, msg: string, timeout=3000: number) {
    const tip = {
      type: type,
      msg: msg
    };

    this.state.tips.push(tip);
    this.forceUpdate();

    setTimeout(() => {
      const index = this.state.tips.indexOf(tip);
      this.state.tips.splice(index, 1);

      this.forceUpdate();
    }, timeout);
  }

  success(msg: string) {
    this.show('ok', msg);
  }

  error(msg: string) {
    this.show('error', msg);
  }

  info(msg: string) {
    this.show('info', msg);
  }

  warn(msg: string) {
    this.show('warning', msg);
  }

  render() {
    let tipList = this.state.tips.map((tip, index) => {
      return (
        <div
          className="poptip-cnt"
          key={'poptip_' + index}>
          <i className={classNames('icon', 'icon-' + tip.type)}></i>{tip.msg}
        </div>
      )
    });

    return (
      <section className="poptip">
        {tipList}
      </section>
    );
  }
}
