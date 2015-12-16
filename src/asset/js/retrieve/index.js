import '../../less/global/global.less';
import '../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'zepto';
import Loading from '../loading/';
import Poptip from '../poptip/';
import querystring from 'querystring';

export default class Retrieve extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 1
    }
  }

  // 验证是否能修改密码
  handleNextSubmit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.tip) {
      this.refs.poptip.warn(this.state.tip);

      return;
    }

    this.refs.loading.show('验证中...');

    $.ajax({
      url: '/mvc/forgetPasswordJson',
      type: 'POST',
      data: {
        loggingUserSnapShotKey: this.state.loggingUserSnapShotKey
      },
      success: (res) => {
        this.refs.loading.close();

        if (res.viewName === 'user/forgetPassword') {
          this.refs.poptip.success('验证通过');

          this.setState({
            step: 2,
            forgetPasswordKey: res.forgetPasswordKey,
            userName: res.userName,
            loggingUserSnapShotKey: res.loggingUserSnapShotKey
          });

          return;
        }

        this.refs.poptip.warn('验证未通过, 请重试');
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  // 修改密码
  handleEditPassword(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if ($.trim(this.state.password) === '') {
      this.refs.poptip.warn('请设置新密码');

      return;
    }

    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/mvc/forgetPasswordSubmitJson',
      type: 'POST',
      data: {
        password: this.state.password,
        confirmCode: 'none',
        comparePassword: this.state.password,
        forgetPasswordKey: this.state.forgetPasswordKey,
        forgetPassword_loggingUserSnapShotKey: this.state.loggingUserSnapShotKey
      },
      success: (res) => {
        this.refs.loading.close();

        if (res.viewName === 'success') {
          this.refs.poptip.success('修改密码成功');

          setTimeout(() => {
            location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
          }, 3000)

          return;
        }

        this.refs.poptip.warn('修改密码失败');
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  // 验证手机号格式
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

  // 获取验证码
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

          this.refs.poptip.success('验证码发送成功');
        },
        error: () => {
          this.refs.loading.close();
          this.refs.poptip.warn('获取验证码失败, 请重试');
        }
      });
    });
  }

  // 服务端校验手机号
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
            loggingUserSnapShotKey: res.loggingUserSnapShotKey
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

  handleBoolChange(field: string, e: Object) {
    let o = {};
    o[field] = e.target.checked;

    this.setState(o);
  }

  renderStepOne() {
    return (
      <form className="form" onSubmit={this.handleNextSubmit.bind(this)}>
        <div className="field-group">
          <div className="field">
            <label className="icon icon-tel"></label>
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
            <label className="icon icon-tel"></label>
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
        </div>
        <div className="actions">
          <button className="btn block teal" type="submit">下一步</button>
        </div>
      </form>
    )
  }

  renderStepTwo() {
    return (
      <form className="form" onSubmit={this.handleEditPassword.bind(this)}>
        <div className="field-group">
          <div className="field">
            <label className="icon icon-tel"></label>
            <div className="control">
              <input
                type="tel"
                disabled={true}
                value={this.state.tel}
              />
            </div>
          </div>
          <div className="field">
            <label className="icon icon-tel"></label>
            <div className="control">
              <input
                type="tel"
                className="verify-code"
                placeholder="用户名"
                disabled={true}
                value={this.state.userName}
              />
            </div>
          </div>
          <div className="field">
            <label className="icon icon-lock"></label>
            <div className="control">
              <input
                type="password"
                placeholder="输入新密码"
                value={this.state.password}
                onChange={this.handleStrChange.bind(this, 'password')}
              />
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="btn block teal" type="submit">完成</button>
        </div>
      </form>
    )
  }

  render() {
    let form;

    switch (this.state.step) {
      case 1:
        form = this.renderStepOne();
        break;
      case 2:
        form = this.renderStepTwo();
        break;
    }

    return (
      <section className="retrieve">
        <div className="logo"><img src="" /></div>
        {form}
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    )
  }
}

ReactDOM.render(<Retrieve />, $('#page').get(0));
