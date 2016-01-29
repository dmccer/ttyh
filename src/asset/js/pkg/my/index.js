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

import LoadMore from '../../load-more/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import PkgItem from '../item/';
import pkgPNG from '../../../img/app/pkg@3x.png';
import Log from '../../log/';
import FixedHolder from '../../fixed-holder/';

export default class MyPkgPage extends Component {
  state = {
    pkgs: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.fetchMyPkgs();
  }

  /**
   * 获取我发布的货源列表
   */
  fetchMyPkgs() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/searchMyProductsForH5',
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

  /**
   * 重新发布货源
   * @param  {Object} pkg 货源对象
   * @param  {ClickEvent} e
   */
  repub(pkg, e) {
    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('发布中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/product_refresh_json',
        type: 'POST',
        data: {
          productID: pkg.product.productID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode === 0) {
        this.refs.poptip.success('重新发布成功');

        this.fetchMyPkgs();
        return;
      }

      this.refs.poptip.warn(res.msg);
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('重新发布失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 删除货源
   * @param  {Object} pkg 货源对象
   * @param  {ClickEvent} e
   */
  del(pkg, e) {
    if (!confirm('确认删除该条货源?')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/product_disable_batch_forH5',
        type: 'POST',
        data: {
          productIDs: pkg.product.productID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode === 0) {
        this.refs.poptip.success('删除货源成功');
        this.fetchMyPkgs();

        return;
      }

      this.refs.poptip.warn(res.msg);
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('删除货源失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 展示货源为空时的提示界面
   * @return {Element}
   */
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

  /**
   * 展示货源列表
   * @return {Element}
   */
  renderPkgList() {
    if (this.state.pkgs.length) {
      let pkgs = this.state.pkgs.map((pkg, index) => {
        return (
          <PkgItem
            {...pkg}
            key={`pkg-item_${index}`}
            repub={this.repub.bind(this, pkg)}
            del={this.del.bind(this, pkg)}
          />
        );
      });

      return (
        <div className="my-pkg">
          {
            // <div className="all-recommend-truck">
            //   <a href="#">一键查看全部推荐车源</a>
            // </div>
          }
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
        <FixedHolder height="70" />
        <a href="./pkg-pub.html" className="pub-btn">发布</a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<MyPkgPage />, $('#page').get(0));
