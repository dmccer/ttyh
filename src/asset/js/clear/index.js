import '../../less/global/global.less';
import '../../less/global/form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import cookie from 'cookie';
import rcookie from 'react-cookie';
import keys from 'lodash/object/keys';
import AH from '../helper/ajax';

import Poptip from '../poptip/';
import Loading from '../loading/';
import {UnbindWX} from './model';

const cookies = cookie.parse(document.cookie);
const cookieNames = keys(cookies);

export default class ClearPage extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
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

  unbindWX() {
    this.ah.one(UnbindWX, (res) => {
      if (res.retcode === 0) {
        this.refs.poptip.success('解绑成功');

        return;
      }

      this.refs.poptip.warn('解绑失败');
    });
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
        <button
          className="btn block teal"
          onClick={this.unbindWX.bind(this)}
        >解绑微信</button>
        <Poptip ref="poptip" />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<ClearPage />, document.querySelector('.page'));
