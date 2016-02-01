/**
 * 左滑功能
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 * Usage:
 *
 * import {TouchLeftEnhance} from 'touch-left';
 *
 * // 使用装饰器或函数调用 TouchLeftEnhance(MyComponent)
 * @TouchLeftEnhance
 * class MyComponent extends React.Component {
 * 		componentWillMount() {
 * 			// 设置左滑最大距离
 * 			this.props.maxLeft(100);
 * 		}
 *
 * 		del() {
 * 			// ...
 * 			// 完成处理后需要 reset
 * 			this.props.reset();
 * 		}
 *
 * 		render() {
 * 			return (
 * 				<div className="container">
 * 					<div
 * 						className="item"
 * 						style={{
 * 							left: props.left + 'px'
 * 						}}
 * 						onTouchStart={props.touchstart}
 * 						onTouchMove={props.touchmove}
 * 						onTouchEnd={props.touchend}
 * 					></div>
 * 				</div>
 * 			);
 * 		}
 * }
 */
import React from 'react';

export var TouchLeftEnhance = ComposedComponent => class extends React.Component {
  static displayName = 'ComponentEnhancedWithTouchLeft';

  state = {
    maxLeft: 150,
    touches: {
      startX: 0,
      startY: 0,
      curX: 0,
      curY: 0,
      left: 0
    }
  };

  constructor(props) {
    super(props);
  }

  maxLeft(max) {
    this.setState({
      maxLeft: max
    });
  }

  transformLeft(left) {
    this.setState({
      posStyle: {
        WebkitTransform: `translate3d(${left}px, 0px, 0px)`,
        transform: `translate3d(${left}px, 0px, 0px)`,
        msTransform: `translateX(${left}px)`
      }
    });
  }

  reset() {
    this.transformLeft(0);

    this.setState({
      left: 0
    });
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

    this.transformLeft(nextLeft);
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
      this.transformLeft(0);

      return;
    }

    if (touches.swipeLength >= this.state.maxLeft / 2) {
      this.setState({
        left: -this.state.maxLeft
      });

      this.transformLeft(-this.state.maxLeft);

      return;
    }
  }

  render() {
    return <ComposedComponent
      {...this.props}
      left={this.state.left}
      transformStyle={this.state.posStyle}
      touchstart={this.touchstart.bind(this)}
      touchmove={this.touchmove.bind(this)}
      touchend={this.touchend.bind(this)}
      maxLeft={this.maxLeft.bind(this)}
      reset={this.reset.bind(this)}  />
  }
}
