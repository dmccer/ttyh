import './index.less';

import React, {Component} from 'react';
import assign from 'lodash/object/assign';
import ActionSheet from '../../action-sheet/';

export default class DemoActionSheet extends Component {
  state = {};

  constructor() {
    super();
  }

  show(params) {
    this.setState(assign({}, {
      on: true
    }, params), () => {
      this.refs.actionSheet.show(params.ass);
    });
  }

  close() {
    this.setState({
      on: false
    });
  }

  render() {
    if (!this.state.on) {
      return null;
    }

    return (
      <section className="demo-action-sheet">
        <div className="demo">
          <div className="inner">
            <img src={this.state.img} />
            <div className="demo-tip">{this.state.tip}</div>
          </div>
        </div>
        <ActionSheet
          ref="actionSheet"
          cancel={this.close.bind(this)} />
      </section>
    );
  }
}
