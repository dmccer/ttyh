/**
 * 货源详情页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';

import Avatar from '../../avatar/';
import AccountCertifyStatus from '../../account-certify-status/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Confirm from '../../confirm/';
import FixedHolder from '../../fixed-holder/';
import PkgMaluationPanel from '../maluation/';
import JWeiXin from '../../jweixin/';
import $ from '../../helper/z';
import AH from '../../helper/ajax';
import {OrderedEnumValue} from '../../model/';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';
import {
  PkgSearch,
  FollowUser
} from '../model/';

export default class PkgDetailPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pkg: {
      product: {}
    },
    maluationItems: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.ah.one(PkgSearch, {
      success: (res) => {
        this.setState({
          pkg: res.data[0]
        });
      },
      error: () => {
        this.refs.poptip.warn('加载货源详情失败, 请重试');
      }
    }, {
      productIDs: this.state.qs.pid
    });

    this.fetchUserInfo();
  }

  fetchUserInfo() {
    this.ah.one(UserVerifyStatus, (res) => {
      this.setState({
        realNameVerifyStatus: res.auditStatus
      });
    });
  }

  handleShowVerifyTip(tel, e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      activeTel: tel
    }, () => {
      let status = this.state.realNameVerifyStatus;

      if (status === 1 || status === 0) {
        this.handleCancelVerify();
        return;
      }

      this.refs.verifyTip.show({
        title: REAL_NAME_CERTIFY_TITLE,
        msg: REAL_NAME_CERTIFY_TIP_FOR_VIEW
      });
    });
  }

  handleCancelVerify() {
    this.refs.telPanel.show({
      title: '拨打电话',
      msg: this.state.activeTel
    });
  }

  madeCall() {
    this.ah.one(OrderedEnumValue, (res) => {
      let list = res.packTypeMap;

      list = list.map((item) => {
        return {
          id: item.key,
          name: item.value
        };
      });

      this.setState({
        maluationItems: list
      }, () => {
        this.refs.pkgMaluation.show();
      });
    }, 'packType');
  }

  handleSelectPkgMaluation(maluation) {
    console.log('maluation:', maluation);
  }

  follow() {
    this.ah.one(FollowUser, {
      success: (res) => {
        if (res.errMsg) {
          this.refs.poptip.warn(res.errMsg);

          return;
        }

        let pkg = this.state.pkg;
        pkg.alreadyFavorite = true;

        this.setState({
          pkg: pkg
        }, () => {
          this.refs.poptip.success('关注成功');
        });
      },
      error: (err) => {
        this.refs.poptip.success('关注失败');
      }
    }, this.state.pkg.product.provideUserID);
  }

  renderFollowStatus() {
    let pkg = this.state.pkg;
    let product = pkg.product;

    if (pkg.alreadyFavorite) {
      return (
        <span
          className="followed">
          <i className="icon icon-correct s20"></i>
          <span><b>已关注</b></span>
        </span>
      );
    }

    return (
      <span
        className="follow"
        onClick={this.follow.bind(this)}>
        <i className="icon icon-plus"></i>
        <span><b>关注</b></span>
      </span>
    );
  }

  toggleMore() {
    this.setState({
      showMore: !this.state.showMore
    });
  }

  renderMemo(memo) {
    if ($.trim(memo) === '') {
      return (<span className="memo">暂无</span>);
    }

    if (memo.length <= 30) {
      return <span className="memo">{memo}</span>;
    }

    let r = this.state.showMore ? memo : `${memo.substring(0, 30)}...`;

    return (
      <span className="memo">
       <span>{r}</span>
       <a href="javascript:void(0)" className="memo-toggler" onClick={this.toggleMore.bind(this)}>{this.state.showMore ? '收起' : '更多'}</a>
      </span>
    );
  }

  render() {
    let pkg = this.state.pkg;
    let product = pkg.product;

    let pkgDesc;

    if (product.title == null &&
      (parseFloat(product.loadLimit) === 0 || product.loadLimit == null)) {
      pkgDesc = '暂无';
    } else {
      let title = product.title && product.title || '';
      let loadLimit = product.loadLimit != null && parseFloat(product.loadLimit) != 0 ? `${product.loadLimit}吨` : '';
      let pack = product.packTypeStr + (product.productCount ? ` * ${product.productCount}` : '');
      let productVolume = product.productVolume != null && parseFloat(product.productVolume) != 0 ? `${product.productVolume}方` : '';
      pkgDesc = `${title} ${loadLimit} ${productVolume} ${pack}`;
    }

    let truckDesc;

    if ($.trim(product.truckTypeStr) == '' &&
      (parseFloat(product.truckLength) === 0 || product.truckLength == null)) {
      truckDesc = '暂无';
    } else {
      let truckLength = product.truckLength != null && parseFloat(product.truckLength) != 0 ? `${product.truckLength}米` : '';
      let useType = product.useType != null && parseInt(product.useType) ? product.useTypeStr : null;
      let stallSize = product.spaceNeeded != null && parseFloat(product.spaceNeeded) ? `占用${product.spaceNeeded}米` : null;
      truckDesc = `${useType} ${product.truckTypeStr || ''} ${truckLength} ${stallSize || ''}`;
    }

    let tel = JWeiXin.isWeixinBrowser() ? <span>电话联系</span> : <span>电话联系: {pkg.product.provideUserMobileNo}</span>

    return (
      <section className="pkg-detail-page">
        <h2 className="subtitle">
          <span>装车日期</span>
          <span className="pub-time">
            <i className="icon icon-clock"></i>
            {pkg.createTime}发布
          </span>
        </h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-calendar s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.product.loadProTime}</span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">路线信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point on s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.product.fromCity}</span>
            </div>
          </div>
          <div className={cx('field', pkg.product.fromAddr != '' ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.product.fromAddr}</span>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point on s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.product.toCity}</span>
            </div>
          </div>
          <div className={cx('field', pkg.product.toAddr != '' ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.product.toAddr}</span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">货物信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkgDesc}</span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">车辆要求</h2>
        <div className="field-group">
          <div className="field">
            <label>
              <i className="icon icon-truck-type s20"></i>
            </label>
            <div className="control">
              <span className="input-holder on">{truckDesc}</span>
            </div>
          </div>
          <div className={cx('field', pkg.product.loadingTypeStr ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder">
                <i className="inner-label">装货方式</i>
                <b className="inner-val">{pkg.product.loadingTypeStr}</b>
              </span>
            </div>
          </div>
          <div className={cx('field', pkg.product.payTypeStr ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">
                <i className="inner-label">运费结算方式</i>
                <b className="inner-val">{pkg.product.payTypeStr}</b>
              </span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">备注</h2>
        <div className="field-group">
          <div className="field memo-field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              {this.renderMemo(pkg.product.memo)}
            </div>
          </div>
        </div>
        <h2 className="subtitle">评价</h2>
        <div className="maluations">
          <span className="maluation-item">
            <span>有效货源 </span>
            <b>(3)</b>
          </span>
          <span className="maluation-item">
            <span>有效货源 </span>
            <b>(3)</b>
          </span>
        </div>
        <div className="row account-info">
          <div className="avatar-col">
            <Avatar img={pkg.provideUserImgUrl} />
          </div>
          <div className="account-col">
            <span>{pkg.providerUserName}</span>
            <AccountCertifyStatus
              type='shipper'
              realNameCertified={pkg.provideUserSfzVerify}
              companyCertified={pkg.provideUserCompanyVerify}
            />
          </div>
          <div className="follow-status-col">
            {this.renderFollowStatus()}
          </div>
        </div>
        <FixedHolder height="50" />
        <a
          onClick={this.handleShowVerifyTip.bind(this, pkg.product.provideUserMobileNo)}
          href={`tel:${pkg.product.provideUserMobileNo}`}
          className={cx('call-btn', pkg.isMyProduct ? 'hide' : '')}>
          <i className="icon icon-call"></i>
          {tel}
        </a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <Confirm
          ref="verifyTip"
          cancel={this.handleCancelVerify.bind(this)}
          rightLink="./real-name-certify.html"
          rightBtnText={'立即认证'}
          leftBtnText={'稍后认证'}
        />
        <Confirm
          ref="telPanel"
          rightLink={`tel:${this.state.activeTel}`}
          rightBtnText={'拨打'}
          leftBtnText={'取消'}
          confirm={this.madeCall.bind(this)}
        />
        <PkgMaluationPanel
          ref="pkgMaluation"
          items={this.state.maluationItems}
          onSelected={this.handleSelectPkgMaluation.bind(this)}
        />
      </section>
    );
  }
}

ReactDOM.render(<PkgDetailPage />, document.querySelector('.page'));
