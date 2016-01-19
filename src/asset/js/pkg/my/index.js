/**
 * 我发布的货源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PkgItem from '../item/';
import pkgPNG from '../../../img/app/pkg@3x.png';

export default class MyPkgPage extends Component {
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
          <div className="img-tip">
            <img src={pkgPNG} />
          </div>
          <p>还没有发布货源<br />赶快开始发布吧</p>
        </div>
      );
    }
  }

  renderPkgList() {
    if (this.state.pkgs.length) {
      return (
        <div className="my-pkg">
          <div className="all-recommend-truck">
            <a href="#">一键查看全部推荐车源</a>
          </div>
          <div className="pkg-list">
            <PkgItem />
            <PkgItem />
            <PkgItem />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="my-pkg-page">
        {this.renderEmpty()}
        {this.renderPkgList()}
        <a className="pub-btn">发布</a>
      </div>
    );
  }
}

ReactDOM.render(<MyPkgPage />, $('#page').get(0));
