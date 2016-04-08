import './index.less';

import React, {Component} from 'react';
import Mask from '../mask/';

export default class ActionSheet extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  show(ass) {
    this.setState({
      on: true,
      ass: ass || []
    });
  }

  cancel() {
    this.setState({
      on: false
    });

    this.props.cancel();
  }

  render() {
    if (!this.state.on) {
      return null;
    }

    let ass = this.state.ass.map((item, index) => {
      return (
        <div
          key={`as-cell_${index}`}
          className="as-cell"
          onClick={item.handler}
        >选择照片</div>
      )
    });

    return (
      <section className="action-sheet">
        <Mask type="black" click={this.cancel.bind(this)} />
        <div className="ass-wrap">
          <div className="ass">
            {ass}
          </div>
          <div className="as-cancel" onClick={this.cancel.bind(this)}>取消</div>
        </div>
      </section>
    );
  }
}
