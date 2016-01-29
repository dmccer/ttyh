/**
 * 处理表单字段改变及格式化
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 * 目前提供以下类型字段处理:
 * 1. 纯数字字符串或整数 - handleIntegerChange
 * 2. 小数或整数 - handleFloatChange
 * 3. 字符串 - handleStrChange
 * 4. 手机号 - handleMobileNoChange
 *
 * Usage:
 *
 * <input
 * 	type="tel"
 * 	value={this.props.tel}
 * 	onChange={this.props.handleMobileNoChange.bind(this, 'tel')}
 * />
 *
 */
import React from 'react';

// for validate
// const FLOAT_REG = /^(([1-9]{1}\d*)|(0))\.\d+$/;
// const INT_REG = /^\d+$/;

export var FieldChangeEnhance = ComposedComponent => class extends React.Component {
  static displayName = 'ComponentEnhancedWithFieldChangeHandler';

  state = {};

  constructor(props) {
    super(props);
  }

  // 纯数字字符串或整数
  handleIntegerChange(field: String, cb: Function, e: Object) {
    if (typeof cb !== 'function') {
      e = cb;
    }

    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d]/g, '')
    }, cb);
  }

  // 小数或整数
  handleFloatChange(field: String, cb: Function, e: Object) {
    if (typeof cb !== 'function') {
      e = cb;
    }

    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d\.]/g, '')
    }, cb)
  }

  // 字符串
  handleStrChange(field: String, cb: Function, e: Object) {
    if (typeof cb !== 'function') {
      e = cb;
    }

    this.setState({
      [field]: $.trim(e.target.value)
    }, cb);
  }

  // 手机号
  handleMobileNoChange(field: String, cb: Function, e: Object) {
    if (typeof cb !== 'function') {
      e = cb;
    }

    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d]/g, '').substring(0, 11)
    }, cb);
  }

  render() {
    return (
      <ComposedComponent
        {...this.props}
        {...this.state}
        handleIntegerChange={this.handleIntegerChange.bind(this)}
        handleFloatChange={this.handleFloatChange.bind(this)}
        handleStrChange={this.handleStrChange.bind(this)}
        handleMobileNoChange={this.handleMobileNoChange.bind(this)}
      />
    );
  }
}
