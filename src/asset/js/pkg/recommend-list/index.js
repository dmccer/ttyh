/**
 * 推荐货源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RecommendPkgItem from './item/';
import pkgPNG from '../../../img/app/pkg@3x.png';

export default class RecommendPkgListPage extends Component {
  state = {
    pkgs: [{}]
  };

  constructor() {
    super();
  }

  renderEmpty() {
    if (!this.state.pkgs.length) {
      return (
        <div className="pkg-empty-tip">
          <p>还没有找到货源</p>
        </div>
      );
    }
  }

  renderPkgList() {
    if (this.state.pkgs.length) {
      return (
        <div className="pkg-list">
          <RecommendPkgItem />
          <RecommendPkgItem />
          <RecommendPkgItem />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="recommend-pkg-list-page">
        {this.renderEmpty()}
        {this.renderPkgList()}
      </div>
    );
  }
}

ReactDOM.render(<RecommendPkgListPage />, $('#page').get(0));
