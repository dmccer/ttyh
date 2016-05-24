import '../../less/global/global.less';
import '../../less/global/form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import cookie from 'cookie';
import rcookie from 'react-cookie';
import keys from 'lodash/object/keys';

import Poptip from '../poptip/';

const cookies = cookie.parse(document.cookie);
const cookieNames = keys(cookies);

export default class ClearPage extends Component {
  constructor() {
    super();
  }

  clearCookie() {
    cookieNames.forEach((name) => {
      rcookie.save(name, null, { path: '/', expires: new Date(), domain: '.ttyhuo.com' });
    });
    this.refs.poptip.success('清除 Cookie 完成');
  }

  clearLocalStorage() {
    localStorage.clear();

    this.refs.poptip.success('清除 localStorage 完成');
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
        >清除 LocalStorage</button>
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<ClearPage />, document.querySelector('.page'));
