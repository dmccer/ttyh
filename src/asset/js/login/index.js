import '../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';

export default class Login extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="login">
        <div className="logo"><img src="" /></div>
        <form className="form">
          <div className="field-group">
            <div className="field">
              <label className="icon icon-tel"></label>
              <div className="control">
                <input type="tel" placeholder="输入手机号" />
              </div>
            </div>
            <div className="field">
              <label className="icon icon-lock"></label>
              <div className="control">
                <input type="text" placeholder="输入密码" />
              </div>
            </div>
          </div>
          <p className="forget">
            <a href="#">
              <i className="icon icon-question"></i>
              忘记密码
            </a>
          </p>
          <div className="actions">
            <button className="btn block teal">登录</button>
            <a href="#" className="btn block teal-line">快速注册</a>
          </div>
        </form>
      </section>
    );
  }
}

ReactDOM.render(<Login />, $('#page').get(0));
