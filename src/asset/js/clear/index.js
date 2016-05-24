import '../../less/global/global.less';
import '../../less/global/form.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import cookie from 'cookie';
import rcookie from 'react-cookie';
import keys from 'lodash/object/keys';

const cookies = cookie.parse(document.cookie);
const cookieNames = keys(cookies);

export default class ClearPage extends Component {
  constructor() {
    super();
  }

  clearCookie() {
    cookieNames.forEach((name) => {
      rcookie.remove(name);
    });
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  render() {
    return (
      <section className="clear-page">
        <button
          className="btn block teal"
          onClick={this.clearCookie.bind(this)}
        >清除 Cookie</button>
        <button
          className="btn block teal"
          onClick={this.clearLocalStorage.bind(this)}
        >清除 localStorage</button>
      </section>
    );
  }
}
