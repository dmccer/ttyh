import '../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Poptip from '../poptip/';
import querystring from 'querystring';

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  handleSubmit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.tip) {
      this.refs.poptip.warn(this.state.tip);
      return;
    }

    $.ajax({
      url: '/mvc/login_confirmJson',
      type: 'POST',
      data: {
        loggingUserSnapShotKey: this.state.loggingUserSnapShotKey,
        password: this.state.password
      },
      success: (res) => {
        if (res.viewName === 'user/home') {
          this.refs.poptip.success('登录成功');

          // 跳转
          let qs = querystring.stringify({
            uid: res.loggedUser.userID,
            token: res.token
          });

          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs.html?' + qs);

          return;
        }

        if (res.viewName === 'user/login/confirm') {
          this.refs.poptip.success('密码不正确');
        }
      },
      error: () => {
        this.refs.poptip.error('系统异常')
      }
    })
  }

  handleTelChange(e: Object) {
    let tel = e.target.value;

    this.setState({
      tel: tel.replace(/[^\d]+/g, '')
    });
  }

  handleFocusPassword(e: Object) {
    $.ajax({
      url: '/mvc/loginJson',
      type: 'POST',
      data: {
        accountNo: this.state.tel
      },
      success: (res) => {
        if (res.viewName === 'user/login/confirm') {
          this.setState({
            tip: null,
            loggingUserSnapShotKey: res.loggingUserSnapShotKey
          });

          return;
        }

        let msg;

        switch(res.viewName) {
          case 'user/login':
            msg = '手机号格式不正确';
            break;
          case 'user/home':
            msg = '服务器已登录';
            break;
          case 'user/register':
            msg = '该号码尚未注册';
            break;
        }

        this.setState({
          tip: msg
        });

        this.refs.poptip.warn(msg);
      },
      error: () => {
        this.refs.poptip.error('系统异常')
      }
    });
  }

  handlePasswordChange(e: Object) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    return (
      <section className="login">
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
              <label className="icon icon-lock"></label>
              <div className="control">
                <input
                  type="password"
                  placeholder="输入密码"
                  value={this.state.password}
                  onFocus={this.handleFocusPassword.bind(this)}
                  onChange={this.handlePasswordChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <p className="forget">
            <a href="./retrieve.html">
              <i className="icon icon-question"></i>
              忘记密码
            </a>
          </p>
          <div className="actions">
            <button className="btn block teal" type="submit">登录</button>
            <a href="./register.html" className="btn block teal-line">快速注册</a>
          </div>
        </form>
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<Login />, $('#page').get(0));
