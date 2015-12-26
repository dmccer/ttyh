import '../../less/global/global.less';
import '../../less/global/form.less';
import '../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../loading/';
import Poptip from '../poptip/';
import querystring from 'querystring';

export default class Register extends React.Component {
  constructor() {
    super();

    this.state = {}
  }

  handleSubmit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.tip) {
      this.refs.poptip.warn(this.state.tip);

      return;
    }

    $.ajax({
      url: '/mvc/registerJson',
      type: 'POST',
      data: {
        password: this.state.password,
        confirmCode: this.state.verifyCode,
        draftUserSnapShotKey: this.state.draftUserSnapShotKey
      },
      success: (res) => {
        if (res.viewName === 'user/home') {
          this.refs.poptip.success('注册成功');

          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html?code=' + this.state.qs.code);
          return;
        }

        if (res.viewName === 'user/login' || res.viewName === 'user/register') {
          this.refs.poptip.warn('验证码过期或错误');

          return;
        }
      }
    })
  }

  validateTel() {
    const tel = $.trim(this.state.tel);

    if (tel === '') {
      this.refs.poptip.warn('请输入手机号');

      return false;
    }

    if (tel.length !== 11) {
      this.refs.poptip.warn('手机号格式不正确');

      return false;
    }

    return true;
  }

  handleGetVerifyCode(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.validateTel()) {
      return;
    }

    this.handleValidateTelRemote(() => {
      this.refs.loading.show('正在获取验证码...');

      this.setState({
        verifyCodeDisabled: true
      });

      $.ajax({
        url: '/mvc/code_msg/sendmsg',
        type: 'POST',
        data: {
          phone: this.state.tel
        },
        success: (data) => {
          this.refs.loading.close();
          console.log(data);

          this.refs.poptip.success('验证码发送成功');
        },
        error: () => {
          this.refs.loading.close();
          this.refs.poptip.warn('获取验证码失败, 请重试');
        }
      });
    });
  }

  handleValidateTelRemote(cb) {
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
            draftUserSnapShotKey: res.draftUserSnapShotKey
          });

          cb();

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

  handleNumChange(field: string, e: Object) {
    let o = {};

    o[field] = $.trim(e.target.value).replace(/[^\d]+/g, '');

    this.setState(o);
  }

  handleStrChange(field: string, e: Object) {
    let o = {};

    o[field] = $.trim(e.target.value);

    this.setState(o);
  }

  handleVerifyCodeChange() {
    this.setState({
      password: e.target.value
    });
  }

  handleBoolChange(field: string, e: Object) {
    let o = {};

    o[field] = e.target.checked;

    this.setState(o);
  }

  render() {
    return (
      <section className="register">
        <div className="logo"><img src={require('../../img/common/logo.png')} /></div>
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="field-group">
            <div className="field">
              <label><i className="icon icon-tel s20"></i></label>
              <div className="control">
                <input
                  type="tel"
                  placeholder="输入手机号"
                  value={this.state.tel}
                  onChange={this.handleNumChange.bind(this, 'tel')}
                />
              </div>
            </div>
            <div className="field">
              <label><i className="icon icon-key s20"></i></label>
              <div className="control">
                <input
                  type="tel"
                  className="verify-code"
                  placeholder="输入验证码"
                  value={this.state.verifyCode}
                  onChange={this.handleNumChange.bind(this, 'verifyCode')}
                />
                <button
                  type="button"
                  className="btn teal verify-tip-btn"
                  onClick={this.handleGetVerifyCode.bind(this)}
                  disabled={this.verifyCodeDisabled}>获取验证码</button>
              </div>
            </div>
            <div className="field">
              <label><i className="icon icon-lock s20"></i></label>
              <div className="control">
                <input
                  type="password"
                  placeholder="设置密码"
                  value={this.state.password}
                  onChange={this.handleStrChange.bind(this, 'password')}
                />
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn block teal" type="submit">注册</button>
            <a href="./login.html" className="btn block teal-line">已有账号</a>
          </div>
          <p className="term">
            <label>
              <input
                type="checkbox"
                value={this.state.term}
                onChange={this.handleBoolChange.bind(this, 'term')}
              /> <a href="./term.html">天天有货服务条款</a>
            </label>
          </p>
        </form>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    )
  }
}

ReactDOM.render(<Register />, $('#page').get(0));
