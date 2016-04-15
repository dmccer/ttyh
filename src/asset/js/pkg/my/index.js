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
import AH from '../../helper/ajax';
import Confirm from '../../confirm/';
import {
  MyPkgSearch,
  RePubPkg,
  DelPkg
} from '../model/';
import {
  RealNameCertifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFING_TIP,
  REAL_NAME_CERTIFY_TIP_FOR_PKGER
} from '../../const/certify';

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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    LoadMore.init(() => {
      if (!this.state.over) {
        this.fetchMyPkgs(this.state.pageIndex);
      }
    });

    this.fetchMyPkgs();
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    this.ah.one(RealNameCertifyStatus, (res) => {
      this.setState({
        realNameVerifyStatus: res.auditStatus
      });
    });
  }

  /**
   * 获取我发布的货源列表
   */
  fetchMyPkgs(slient) {
    this.ah.one(MyPkgSearch, {
      success: (res) => {
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
      },
      error: () => {
        this.refs.poptip.warn('获取我发布的货源失败,请重试');
      }
    }, {
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex
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

    this.ah.one(RePubPkg, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(ERR_MSG_REPUB[res.retcode]);
          return;
        }

        this.refs.poptip.success('重新发布成功');

        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('重新发布失败');
      }
    }, pkg.product.productID);
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

    this.ah.one(DelPkg, {
      success: (res) => {
        if (res.retcode === 0) {
          this.refs.poptip.success('删除货源成功');

          setTimeout(() => {
            location.reload();
          }, 1500);
          return;
        }

        this.refs.poptip.warn(res.msg);
      },
      error: (err) => {
        Log.error(err);
        this.refs.poptip.warn('删除货源失败');
      }
    }, pkg.product.productID);
  }

  handleGoToPub(e) {
    let status = this.state.realNameVerifyStatus;

    if (status === 1) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.refs.verifyTip.show({
      title: REAL_NAME_CERTIFY_TITLE,
      msg: status === 0 ? REAL_NAME_CERTIFING_TIP : REAL_NAME_CERTIFY_TIP_FOR_PKGER
    });

    return;
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
        <a href="./pkg-pub.html" onClick={this.handleGoToPub.bind(this)} className="pub-btn">发布</a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <Confirm
          ref="verifyTip"
          rightLink="./real-name-certify.html"
          rightBtnText={'立即认证'}
          leftBtnText={'稍后认证'}
        />
      </div>
    );
  }
}

ReactDOM.render(<MyPkgPage />, document.querySelector('.page'));
