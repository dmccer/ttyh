import '../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Poptip from '../poptip/';
import querystring from 'querystring';

export default class Register extends React.Component {
  constructor() {
    super()
  }

  render() {
    <section className="register">
      <div className="logo"><img src="" /></div>
      <form className="form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="field-group">
          <div className="field">
            <label className="icon icon-tel"></label>
            <div className="control">
              <input
                type="tel"
                placeholder="输入手机号"
                value={this.state.tel}
                onChange={this.handleTelChange.bind(this)}
              />
            </div>
          </div>
          <div className="field">
            <label className="icon icon-tel"></label>
            <div className="control">
              <input
                type="tel"
                placeholder="输入验证码"
                value={this.state.verify_code}
                onChange={this.handleTelChange.bind(this)}
              />
              <button type="button" className="btn teal">获取验证码</button>
            </div>
          </div>
          <div className="field">
            <label className="icon icon-lock"></label>
            <div className="control">
              <input
                type="password"
                placeholder="设置密码"
                value={this.state.password}
                onFocus={this.handleFocusPassword.bind(this)}
                onChange={this.handlePasswordChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="btn block teal" type="submit">注册</button>
          <a href="./login.html" className="btn block teal-line">已有账号</a>
        </div>
        <p>
          <input type="checkbox" /> 天天有货服务条款
        </p>
      </form>
      <Poptip ref="poptip" />
    </section>
  }
}

ReactDOM.render(<Register />, $('#page').get(0));
