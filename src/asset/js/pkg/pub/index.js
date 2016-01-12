import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import querystring from 'querystring';

export default class PkgPubPage extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      qs: query
    };
  }

  render() {
    return (
      <section className="pkg-pub">
        <h2 className="subtitle"><b>*</b>地址信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point s20"></i></label>
            <div className="control">
              <span className="input-holder">请选择出发地址</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point s20"></i></label>
            <div className="control">
              <span className="input-holder">请选择到达地址</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <h2 className="subtitle"><b>*</b>货车要求</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-truck-type s20"></i></label>
            <div className="control">
              <span className="input-holder">所有车型</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <span className="input-holder">货物种类</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-weight s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货重"
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <a href="./pkg-pub-memo.html" className="input-holder">备注</a>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <button className="btn block teal pub-btn" type="submit">发布</button>
        <div className="fixed-holder"></div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, $('#page').get(0));
