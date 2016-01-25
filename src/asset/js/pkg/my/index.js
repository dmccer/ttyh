/**
 * 我发布的货源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';

import Loading from '../../loading/';
import Poptip from '../../poptip/';
import PkgItem from '../item/';
import pkgPNG from '../../../img/app/pkg@3x.png';

export default class MyPkgPage extends Component {
  state = {
    pkgs: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');
    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/searchProductsForH5',
        type: 'GET',
        success: resolve,
        error: reject
      });
    })
    .then((res) => {
      this.setState({
        pkgs: res.data
      });
    })
    .catch(() => {
      this.refs.poptip.warn('获取我发布的货源失败,请重试');
    })
    .done(() => {
      this.refs.loading.close();
    });
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
    // <div className="all-recommend-truck">
    //   <a href="#">一键查看全部推荐车源</a>
    // </div>
    if (this.state.pkgs.length) {
      let pkgs = this.state.pkgs.map((pkg, index) => {
        return <PkgItem {...pkg} key={`pkg-item_${index}`} />;
      });

      return (
        <div className="my-pkg">
          <div className="pkg-list">
            {pkgs}
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
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<MyPkgPage />, $('#page').get(0));
