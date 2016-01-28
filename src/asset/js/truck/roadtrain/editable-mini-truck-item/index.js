import './index.less';

import React from 'react';
import MiniTruckItem from '../mini-truck-item/';
import {TouchLeftEnhance} from '../../../enhance/touch-left';

@TouchLeftEnhance
export default class EditableMiniTruckItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.maxLeft(50);
  }


  remove() {
    if (confirm('是否删除该车?')) {
      this.props.del(this.props.truckID);

      this.props.reset();
    }
  }

  render() {
    let props = this.props;

    return (
      <div className="editable-mini-truck-item">
        <div
          className="mini-truck-item-container"
          style={{
            left: props.left + 'px'
          }}
          onTouchStart={props.touchstart}
          onTouchMove={props.touchmove}
          onTouchEnd={props.touchend}
          onClick={props.select}
        >
          <MiniTruckItem {...this.props}/>
        </div>
        <ul className="actions row">
          <li className="remove" onClick={this.remove.bind(this)}>删除</li>
        </ul>
      </div>
    );
  }
}
