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
import Promise from 'promise';

import Avatar from '../../avatar/';
import AccountCertifyStatus from '../../account-certify-status/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import FixedHolder from '../../fixed-holder/';

export default class PkgDetailPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pkg: {
      product: {}
    }
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.refs.loading.show('加载中...')
    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/searchProductsForH5',
        type: 'GET',
        cache: false,
        data: {
          productIDs: this.state.qs.pid
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        pkg: res.data[0]
      });
    }).catch((...args) => {
      console.log(args)
      this.refs.poptip.warn('加载货源详情失败, 请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  follow() {
    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/followForBBS_' + this.state.pkg.product.provideUserID,
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    })
    .then((res) => {
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
    })
    .catch(() => {
      this.refs.poptip.success('关注失败');
    })
    .done(() => {
      this.refs.loading.close();
    });
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

    if (product.title == null && (parseFloat(product.loadLimit) === 0 || product.loadLimit == null)) {
      pkgDesc = '暂无';
    } else {
      let title = product.title && product.title || '';
      let loadLimit = product.loadLimit != null && parseFloat(product.loadLimit) != 0 ? `${product.loadLimit}吨` : '';

      pkgDesc = `${title} ${loadLimit}`;
    }

    let truckDesc;

    if ($.trim(product.truckTypeStr) == '' &&
      (parseFloat(product.loadLimit) === 0 || product.loadLimit == null) &&
      (parseFloat(product.truckLength) === 0 || product.truckLength == null)) {
      truckDesc = '暂无';
    } else {
      let truckLength = product.truckLength != null && parseFloat(product.truckLength) != 0 ? `${product.truckLength}米` : '';
      truckDesc = `${product.truckTypeStr || ''} ${truckLength}`;
    }

    return (
      <section className="pkg-detail-page">
        <h2 className="subtitle">
          <span>货源详情</span>
          <span className="pub-time">
            <i className="icon icon-clock"></i>
            {pkg.createTime}发布
          </span>
        </h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point on s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                value={pkg.product.fromCity} />
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point on s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                value={pkg.product.toCity} />
            </div>
          </div>
        </div>
        <h2 className="subtitle">货物信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                value={pkgDesc} />
            </div>
          </div>
        </div>
        <h2 className="subtitle">车辆要求</h2>
        <div className="field-group">
          <div className="field truck-field">
            <label>
              <i className="icon icon-truck-type s20"></i>
            </label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                value={truckDesc} />
            </div>
          </div>
        </div>
        <h2 className="subtitle">备注</h2>
        <div className="field-group">
          <div className="field memo-field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              {this.renderMemo(pkg.product.memo)}
              {
                // <span className="contact-count">
                //   <b>{pkg.product.contactCount}</b>
                //   位车主联系过该货源
                // </span>
              }
            </div>
          </div>
        </div>
        <div className="row">
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
        <a href={`tel:${pkg.product.provideUserMobileNo}`} className="call-btn">
          <i className="icon icon-call"></i>
          <span>电话联系</span>
        </a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<PkgDetailPage />, $('#page').get(0));
