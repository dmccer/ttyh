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
import MiniReadableTime from '../../bbs/readable-time';
import Detect from '../../helper/detect';
import WXVerify from '../../helper/wx';
import WX from '../../const/wx';
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
  PkgDetail,
  // PkgSearch,
  FollowUser,
  Maluation,
  MaluationOfPkg
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

  wxVerify() {
    return new Promise((resolve, reject) => {
      WXVerify({
        url: WX.url,
        appId: WX.appId,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone'
        ]
      }, (err) => {
        if (err) {
          this.refs.poptip.warn('微信验证失败');

          reject();
          return;
        }

        resolve();
      });
    });
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    Promise
      .all([this.wxVerify(), this.fetchPkg()])
      .then(this.share.bind(this));

    this.fetchUserInfo();
    this.fetchMaluation();
  }

  share() {
    const pkg = this.state.pkg;
    const title = `${pkg.fromCity} - ${pkg.toCity}`;
    const link = location.href;
    const imgUrl = 'http://ttyhuo-img.b0.upaiyun.com/2016/02/23/01/33_18_upload_usericonimage_file54.png!small';
    const desc = this.buildPkgDesc();

    const params = { link, title, imgUrl, desc };

    wx.onMenuShareTimeline(params);
    wx.onMenuShareAppMessage(params);
    wx.onMenuShareQQ(params);
    wx.onMenuShareQZone(params);
  }

  fetchPkg() {
    return new Promise((resolve, reject) => {
      this.ah.one(PkgDetail, {
        success: (res) => {
          this.setState({
            pkg: res.product
          }, resolve);
        },
        error: () => {
          this.refs.poptip.warn('加载货源详情失败, 请重试');
          reject();
        }
      }, this.state.qs.pid);
    });
  }

  fetchUserInfo() {
    this.ah.one(UserVerifyStatus, (res) => {
      this.setState({
        realNameVerifyStatus: res.auditStatus
      });
    });
  }

  fetchMaluation() {
    this.ah.one(MaluationOfPkg, (res) => {
      if (res.retcode !== 0) {
        return this.refs.poptip.warn(res.msg);
      }

      this.setState({
        comments: res.commentCountList
      });
    }, {
      businessId: this.state.qs.pid,
      businessType: 2
    });
  }

  handleShowVerifyTip(tel, e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      activeTel: tel
    }, () => {
      let status = this.state.realNameVerifyStatus;

      if (status === 1 || status === 0 || this.state.qs.from) {
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
    if (this.state.qs.from === 'app') {
      return;
    }

    if (this.state.maluationItems && this.state.maluationItems.length) {
      this.setState({
        maluationTel: this.state.activeTel,
        maluationId: this.state.qs.pid
      }, () => {
        this.refs.pkgMaluation.show();
      });

      return;
    }

    this.ah.one(OrderedEnumValue, (res) => {
      let list = res.productAppraise;

      list = list.map((item) => {
        return {
          id: item.key,
          name: item.value
        };
      });

      this.setState({
        maluationTel: this.state.activeTel,
        maluationId: this.state.qs.pid,
        maluationItems: list
      }, () => {
        this.refs.pkgMaluation.show();
      });
    }, 'productAppraise');
  }

  handleSelectPkgMaluation(maluation) {
    this.ah.one(Maluation, (res) => {
      if (res.retcode === 0) {
        this.refs.poptip.success('感谢您的评价');

        setTimeout(() => {
          location.reload();
        }, 1500);
        return;
      }

      this.refs.poptip.warn(res.msg);
    }, {
      businessId: this.state.qs.pid,
      // 车源 0 | 货源 1
      businessType: 1,
      commentType: maluation.id
    });
  }

  follow() {
    this.ah.one(FollowUser, {
      success: (res) => {
        if (res.errMsg) {
          this.refs.poptip.warn(res.errMsg);

          return;
        }

        let pkg = this.state.pkg;
        pkg.alreadyFellow = true;

        this.setState({
          pkg: pkg
        }, () => {
          this.refs.poptip.success('关注成功');
        });
      },
      error: (err) => {
        this.refs.poptip.success('关注失败');
      }
    }, this.state.pkg.provideUserID);
  }

  renderFollowStatus() {
    let pkg = this.state.pkg;

    if (pkg.alreadyFellow) {
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

  renderComments() {
    let comments = this.state.comments;

    if (comments && comments.length) {
      let list = comments.map((comment, index) => {
        return (
          <span className="maluation-item" key={`comment-item_${index}`}>
            <span>{comment.commentTypeStr}</span>
            <b>{`(${comment.commentCount})`}</b>
          </span>
        );
      })

      return (
        <div>
          <h2 className="subtitle">评价</h2>
          <div className="maluations">
            {list}
          </div>
        </div>
      );
    }
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

  buildPkgDesc() {
    let pkg = this.state.pkg;
    let pkgDesc;

    if (pkg.title == null &&
      (parseFloat(pkg.loadLimit) === 0 || pkg.loadLimit == null)) {
      pkgDesc = '暂无';
    } else {
      let title = pkg.title && pkg.title || '';
      let loadLimit = pkg.loadLimit != null && parseFloat(pkg.loadLimit) != 0 ? `${pkg.loadLimit}吨` : '';
      let pack = pkg.packTypeStr + (pkg.productCount ? ` * ${pkg.productCount}` : '');
      let productVolume = pkg.productVolume != null && parseFloat(pkg.productVolume) != 0 ? `${pkg.productVolume}方` : '';
      pkgDesc = `${title} ${loadLimit} ${productVolume} ${pack}`;
    }

    return pkgDesc;
  }

  buildTruckDesc() {
    let pkg = this.state.pkg;
    let truckDesc;

    if ($.trim(pkg.truckTypeStr) == '' &&
      (parseFloat(pkg.truckLength) === 0 || pkg.truckLength == null)) {
      truckDesc = '暂无';
    } else {
      let truckLength = pkg.truckLength != null && parseFloat(pkg.truckLength) != 0 ? `${pkg.truckLength}米` : '';
      let useType = pkg.useType != null && parseInt(pkg.useType) ? pkg.useTypeStr : '';
      let stallSize = pkg.spaceNeeded != null && parseFloat(pkg.spaceNeeded) ? `占用${pkg.spaceNeeded}米` : null;
      truckDesc = `${useType} ${pkg.truckTypeStr || ''} ${truckLength} ${stallSize || ''}`;
    }

    return truckDesc;
  }

  render() {
    let pkg = this.state.pkg;

    let pkgDesc = this.buildPkgDesc();
    let truckDesc = this.buildTruckDesc();

    let tel = Detect.isWeiXin() ? <span>电话联系</span> : <span>电话联系: {pkg.provideUserMobileNo}</span>

    return (
      <section className="pkg-detail-page">
        <h2 className="subtitle">
          <span>装车日期</span>
          <span className="pub-time">
            <i className="icon icon-clock"></i>
            <MiniReadableTime time={new Date(pkg.createTime)} />发布
          </span>
        </h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-calendar s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.loadProTime}</span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">路线信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point on s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.fromCity}</span>
            </div>
          </div>
          <div className={cx('field', pkg.fromAddr != '' ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.fromAddr}</span>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point on s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.toCity}</span>
            </div>
          </div>
          <div className={cx('field', pkg.toAddr != '' ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">{pkg.toAddr}</span>
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
          <div className={cx('field', pkg.loadingTypeStr ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder">
                <i className="inner-label">装货方式</i>
                <b className="inner-val">{pkg.loadingTypeStr}</b>
              </span>
            </div>
          </div>
          <div className={cx('field', pkg.payTypeStr ? '' : 'hide')}>
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span className="input-holder on">
                <i className="inner-label">运费结算方式</i>
                <b className="inner-val">{pkg.payTypeStr}</b>
              </span>
            </div>
          </div>
        </div>
        <h2 className="subtitle">备注</h2>
        <div className="field-group">
          <div className="field memo-field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              {this.renderMemo(pkg.memo)}
            </div>
          </div>
        </div>
        {this.renderComments()}
        <div className="row account-info">
          <div className="avatar-col">
            <Avatar img={pkg.provideUserImgUrl} />
          </div>
          <div className="account-col">
            <span>{pkg.provideUserName}</span>
            <AccountCertifyStatus
              type='shipper'
              realNameCertified={pkg.userVerifyStatus == 1}
              companyCertified={pkg.companyVerifyStatus == 1}
            />
          </div>
          <div className="follow-status-col">
            {this.renderFollowStatus()}
          </div>
        </div>
        <FixedHolder height={this.state.qs.from === 'app' ? 130 : 50} />
        <div className="footer-acts">
          <a
            onClick={this.handleShowVerifyTip.bind(this, pkg.provideUserMobileNo)}
            href={`tel:${pkg.provideUserMobileNo}`}
            className={cx('call-btn', pkg.isMyProduct ? 'hide' : '')}>
            <i className="icon icon-call"></i>
            {tel}
          </a>
          {
            this.state.qs.from === 'app' ? (
              <a
                href="http://a.app.qq.com/o/simple.jsp?pkgname=cn.ttyhuo"
                className="download">
                <img src={require('../../../img/app/download@3x.png')} className="download-img" />
              </a>
            ) : null
          }
        </div>

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
          tel={this.state.maluationTel}
          targetId={this.state.maluationId}
          items={this.state.maluationItems}
          onSelected={this.handleSelectPkgMaluation.bind(this)}
        />
      </section>
    );
  }
}

ReactDOM.render(<PkgDetailPage />, document.querySelector('.page'));
