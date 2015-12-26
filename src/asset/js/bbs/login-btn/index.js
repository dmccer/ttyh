import '../../../less/global/global.less';
import './index.less';

import React from 'react';
import querystring from 'querystring';

export default class LoginBtn extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  render() {
    let qs = querystring.stringify(this.state.qs);
    let loginUrl = `/login.html?${qs}`;

    return (
      <div className="login-btn">
        <a href={loginUrl}>
          <i className="icon icon-avatar"></i>
          <span>登录</span>
        </a>
      </div>
    )
  }
}
