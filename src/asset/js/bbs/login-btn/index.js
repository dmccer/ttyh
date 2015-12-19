import '../../../less/global/global.less';
import './index.less';

import React from 'react';

export default class LoginBtn extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="login-btn">
        <a href="./login.html">
          <i className="icon icon-avatar"></i>
          <span>登录</span>
        </a>
      </div>
    )
  }
}
