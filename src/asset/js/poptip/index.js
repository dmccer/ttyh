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

    // 同一提示不重复显示
    let hasTip = this.state.tips.filter((item) => {
      return tip.type === item.type && tip.msg === item.msg;
    });

    if (!hasTip || hasTip.length) {
      return;
    }

    this.state.tips.push(tip);
    this.forceUpdate();

    setTimeout(this.close.bind(this, tip), timeout);
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

  close(tip: Object) {
    const index = this.state.tips.indexOf(tip);
    this.state.tips.splice(index, 1);

    this.forceUpdate();
  }

  render() {
    let tipList = this.state.tips.map((tip, index) => {
      return (
        <div
          className="poptip-cnt"
          key={'poptip_' + index}
          onClick={this.close.bind(this, tip)}>
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
