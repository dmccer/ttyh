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
import querystring from 'querystring';

import LoadMore from '../../load-more/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import PkgItem from '../item/';
import pkgPNG from '../../../img/app/pkg@3x.png';
import Log from '../../log/';
import FixedHolder from '../../fixed-holder/';

const ERR_MSG_REPUB = {
  1001: '您没有登录',
  1002: '您没有登录',
  1003: '未找到要重新发布的车源',
  1004: '重新发布失败'
};

export default class MyPkgPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 15,
    pkgs: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    LoadMore.init(() => {
      if (!this.state.over) {
        this.fetchMyPkgs(this.state.pageIndex);
      }
    });

    this.fetchMyPkgs();
  }

  /**
   * 获取我发布的货源列表
   */
  fetchMyPkgs(slient) {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/searchMyProductsForH5',
        type: 'GET',
        data: {
          pageSize: this.state.pageSize,
          pageIndex: this.state.pageIndex
        },
        success: resolve,
        error: reject
      });
    })
    .then((res) => {
      let pkgs = this.state.pkgs;

      if (!res.data || !res.data.length) {
        if (!pkgs.length || slient) {
          // 空列表，没有数据
          return;
        }

        this.refs.poptip.info('没有更多了');

        this.setState({
          over: true
        });

        return;
      }

      pkgs = pkgs.concat(res.data);

      this.setState({
        pkgs: pkgs,
        pageIndex: this.state.pageIndex + 1
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
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG_REPUB[res.retcode]);
        return;
      }

      this.refs.poptip.success('重新发布成功');

      setTimeout(() => {
        location.reload();
      }, 2000);
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
        setTimeout(() => {
          location.reload();
        }, 2000);

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
