import '../../less/global/global.less';
import '../../less/global/form.less';
import '../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Poptip from '../poptip/';
import Loading from '../loading/';
import querystring from 'querystring';

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      count: '获取验证码'
    };
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

  handleSubmit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.tip) {
      this.refs.poptip.warn(this.state.tip);
      return;
    }

    if (!this.validateTel()) {
      return;
    }

    if (!this.state.verifyCode) {
      this.refs.poptip.warn('验证码不能为空');
      return;
    }

    if (!this.state.loggingUserSnapShotKey && !this.state.draftUserSnapShotKey) {
      this.refs.poptip.warn('请先获取验证码');
      return;
    }

    let url, data = {
      confirmCode: this.state.verifyCode
    };

    if (this.state.loggingUserSnapShotKey) {
      url = '/mvc/login_confirmJsonNew';
      data.loggingUserSnapShotKey = this.state.loggingUserSnapShotKey;
    }

    if (this.state.draftUserSnapShotKey) {
      url = '/mvc/registerJsonNew';
      data.draftUserSnapShotKey = this.state.draftUserSnapShotKey;
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: data,
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

        let msg;

        switch (res.viewName) {
          case 'user/login/confirm':
          case 'user/register':
            msg = '验证码不正确';
            break;
          case 'user/login':
            msg = '系统异常';
            break;
          case 'err':
            msg = res.errMsg;
            break;
        }

        this.refs.poptip.warn(msg);
      },
      error: () => {
        this.refs.poptip.error('系统异常');
      }
    })
  }

  count_down() {
    let count = 60;

    let fn = () => {
      count--;

      if (count === 0) {
        this.setState({
          count: '获取验证码',
          verifyCodeDisabled: false
        });

        return;
      }

      this.setState({
        count: '获取验证码(' + count + 's)'
      });

      setTimeout(fn, 1000);
    }

    fn();
  }

  handleGetVerifyCode(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.validateTel()) {
      return;
    }

    if (this.state.verifyCodeDisabled) {
      this.refs.poptip.info('验证码已发送');

      return;
    }

    this.count_down();

    this.handleValidateTelRemote(() => {
      this.setState({
        verifyCodeDisabled: true
      });
    });
  }

  handleValidateTelRemote(cb) {
    this.refs.loading.show('正在获取验证码...');

    $.ajax({
      url: '/mvc/loginJsonNew',
      type: 'POST',
      data: {
        accountNo: this.state.tel
      },
      success: (res) => {
        this.refs.loading.close();

        if (res.viewName === 'user/login/confirm') {
          this.refs.poptip.success('验证码发送成功');

          this.setState({
            tip: null,
            loggingUserSnapShotKey: res.loggingUserSnapShotKey
          });

          cb();

          return;
        }

        if (res.viewName === 'user/register') {
          this.refs.poptip.success('验证码发送成功');

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

  render() {
    return (
      <section className="login">
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
                  disabled={this.state.verifyCodeDisabled}>{this.state.count}</button>
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn block teal" type="submit">登录</button>
          </div>
        </form>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<Login />, $('#page').get(0));
