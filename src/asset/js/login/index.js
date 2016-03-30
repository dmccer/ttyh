import '../../less/global/global.less';
import '../../less/global/form.less';
import '../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Poptip from '../poptip/';
import Loading from '../loading/';
import querystring from 'querystring';
import $ from '../helper/z';
import AH from '../helper/ajax';
import {SendVerifyCode, Login} from '../account/model/';

export default class LoginPage extends React.Component {
  state = {
    count: '获取验证码',
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
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

  // 登录处理
  handleSubmit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.submiting) {
      return;
    }

    _hmt.push(['_trackEvent', '登录/注册', '点击登录/注册', new Date().toLocaleString()]);

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

    this.setState({
      submiting: true
    });

    let data = {
      confirmCode: this.state.verifyCode,
      action: this.state.action,
      userName: ''
    };

    switch(this.state.action) {
      case 1:
        data.loggingUserSnapShotKey = this.state.loggingUserSnapShotKey;
        break;
      case 2:
        data.draftUserSnapShotKey = this.state.draftUserSnapShotKey;
        break;
      default:
        break;
    }

    this.ah.one(Login, {
      success: ok.bind(this),
      error: fail.bind(this)
    }, data);

    function ok(res) {
      if (res.viewName === 'user/home') {
        _hmt.push(['_setCustomVar', 1, 'login', '登录成功', 2]);
        this.refs.poptip.success('登录成功');

        // 跳转
        let qs = querystring.stringify({
          uid: res.loggedUser.userID
        });

        // 登录后将 user token 和 code 存入本地，后面请求接口需要以 token 或 code 作为参数
        localStorage.setItem('user', JSON.stringify({
          token: res.token
        }));


        if (this.state.qs.page) {
          // location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/${this.state.qs.page}.html?${qs}`);
          return;
        }

        // location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs.html?' + qs);
        return;
      }

      _hmt.push(['_setCustomVar', 1, 'login', '登录失败', 2]);

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

      this.setState({
        submiting: false
      });
    }

    function fail() {
      _hmt.push(['_setCustomVar', 1, 'login', '登录失败', 2]);
      this.refs.poptip.error('系统异常');

      this.setState({
        submiting: false
      });
    }
  }

  // 倒计时
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

  // 获取验证码处理
  handleGetVerifyCode(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    _hmt.push(['_trackEvent', '登录/注册', '点击获取验证码', new Date().toLocaleString()]);

    if (!this.validateTel()) {
      return;
    }

    if (this.state.verifyCodeDisabled) {
      this.refs.poptip.info('验证码已发送');

      return;
    }

    this.count_down();

    this.setState({
      verifyCodeDisabled: true
    });

    this.handleValidateTelRemote();
  }

  // 验证手机
  handleValidateTelRemote() {
    let ok = (res) => {
      if (res.viewName === 'user/home') {
        _hmt.push(['_setCustomVar', 1, 'login', '自动登录', 2]);

        let qs = querystring.stringify({
          uid: res.loggedUser.userID
        });

        // 登录后将 user token 和 code 存入本地，后面请求接口需要以 token 或 code 作为参数
        localStorage.setItem('user', JSON.stringify({
          token: res.token
        }));

        location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs.html?' + qs);
      }

      if (res.viewName === 'user/login/confirm') {
        _hmt.push(['_setCustomVar', 1, 'post_verify_code', '成功', 2]);

        this.refs.poptip.success('验证码发送成功');

        this.setState({
          tip: null,
          action: 1,
          loggingUserSnapShotKey: res.loggingUserSnapShotKey
        });

        return;
      }

      if (res.viewName === 'user/register') {
        _hmt.push(['_setCustomVar', 1, 'post_verify_code', '成功', 2]);

        this.refs.poptip.success('验证码发送成功');

        this.setState({
          tip: null,
          action: 2,
          draftUserSnapShotKey: res.draftUserSnapShotKey
        });

        return;
      }

      _hmt.push(['_setCustomVar', 1, 'post_verify_code', '失败', 2]);

      let msg;

      switch(res.viewName) {
        case 'user/login':
          msg = '手机号格式不正确';
          break;
      }

      this.setState({
        tip: msg
      });

      this.refs.poptip.warn(msg);
    };

    let fail = () => {
      _hmt.push(['_setCustomVar', 1, 'post_verify_code', '失败', 2]);
      this.refs.poptip.error('系统异常');
    };

    this.ah.one(SendVerifyCode, {
      success: ok.bind(this),
      error: fail.bind(this)
    }, this.state.tel);
  }

  // 处理数字型字段发生改变
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

ReactDOM.render(<LoginPage />, document.querySelector('.page'));
