import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';

export default class PkgPubMemoPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <form className="form">
        <div className="control">
          <textarea placeholder="添加备注"></textarea>
        </div>
        <div className="memo-tag-list">
          <div className="tag">价格急走</div>
          <div className="tag">货主在等</div>
          <div className="tag">免过路费</div>
          <div className="tag">一装二卸</div>
          <div className="tag">二装二卸</div>
          <div className="tag">今订明装</div>
          <div className="tag">下雨也装</div>
          <div className="tag">卸车结款</div>
          <div className="tag">价格面议</div>
          <div className="tag">随到随装</div>
        </div>
      </form>
    );
  }
}

ReactDOM.render(<PkgPubMemoPage />, $('#page').get(0));
