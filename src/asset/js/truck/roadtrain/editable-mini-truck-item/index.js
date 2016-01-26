import './index.less';

import React from 'react';
import MiniTruckItem from '../mini-truck-item/';

export default class EditableMiniTruckItem extends React.Component {
  constructor() {
    super();

    this.state = {
      maxLeft: 50,
      touches: {
        startX: 0,
        startY: 0,
        curX: 0,
        curY: 0,
        left: 0
      }
    }
  }

  touchstart(e) {
    if (this.state.dragging) {
      return;
    }

    let px = (e.touches !== undefined) ? e.touches[0].pageX : e.clientX;
    let py = (e.touches !== undefined) ? e.touches[0].pageY : e.clientY;

    let left = this.state.left;
    let touches = {
      startX: px,
      startY: py,
      curX: px,
      curY: py,
      left: left || 0
    };

    this.setState({
      dragging: true,
      touches: touches
    });
  }

  touchmove(e) {
    if (!this.state.dragging) {
      return;
    }

    let touches = this.state.touches;
    let curLeft = touches.left || 0;

    let curX = (e.touches) ? e.touches[0].pageX : e.clientX;
    let curY = (e.touches) ? e.touches[0].pageY : e.clientY;
    let direction = curX > touches.startX ? 1 : -1;

    // 初始状态右滑静止
    if (curLeft === 0 && direction === 1) {
      return;
    }

    // 当前状态已经是最大值，则不能继续滑动
    if (curLeft === this.state.maxLeft * direction) {
      return;
    }

    touches.curX = curX;
    touches.curY = curY;

    touches.direction = direction;
    touches.swipeLength = Math.round(Math.sqrt(Math.pow(touches.curX - touches.startX, 2)));

    // 滑动距离超过最大值, 滑动距离采用最大值
    if (touches.swipeLength >= this.state.maxLeft) {
      touches.swipeLength = this.state.maxLeft;
    }

    let nextLeft = curLeft + touches.direction * touches.swipeLength;

    this.setState({
      touches: touches,
      left: nextLeft
    });
  }

  touchend(e) {
    if (!this.state.dragging) {
      return;
    }

    let touches = this.state.touches;

    this.setState({
      touches: {},
      dragging: false
    });

    if (touches.swipeLength < this.state.maxLeft / 2 ||
      touches.left === 0 && !touches.direction ||
      touches.direction > 0) {
      this.setState({
        left: 0
      });

      return;
    }

    if (touches.swipeLength >= this.state.maxLeft / 2) {
      this.setState({
        left: -this.state.maxLeft
      });

      return;
    }
  }

  remove() {
    if (confirm('是否删除该车?')) {
      this.props.del(this.props.truckID);

      this.setState({
        left: 0
      });
    }
  }

  render() {
    return (
      <div className="editable-mini-truck-item">
        <div
          className="mini-truck-item-container"
          style={{
            left: this.state.left + 'px'
          }}
          onTouchStart={this.touchstart.bind(this)}
          onTouchMove={this.touchmove.bind(this)}
          onTouchEnd={this.touchend.bind(this)}
          onClick={this.props.select}
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
