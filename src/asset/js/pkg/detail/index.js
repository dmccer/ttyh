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

import ReadableTime from '../../bbs/readable-time/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';

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
        data: {
          productIDs: this.state.qs.pid
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        pkg: res.pkg
      });
    }).catch(() => {
      this.refs.poptip.warn('加载货源详情失败, 请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  render() {
    let pkg = this.state.pkg;

    return (
      <section className="pkg-detail-page">
        <h2 className="subtitle">
          <span>货源详情</span>
          <ReadableTime time={pkg.product.createTime} />
        </h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                value={pkg.product.fromCity} />
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point s20"></i></label>
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
                value={`${pkg.product.title || ''} ${pkg.product.pkgWeight != null ? (pkg.product.pkgWeight + '吨') : ''}`} />
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
                value={`${pkg.product.truckTypeStr || ''} ${pkg.product.loadLimit != null ? (pkg.product.loadLimit + '吨') : ''} ${pkg.product.truckLength != null ? (pkg.product.truckLength + '米') : ''}`} />
            </div>
          </div>
        </div>
        <h2 className="subtitle">备注</h2>
        <div className="field-group">
          <div className="field memo-field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <span className="memo">{pkg.product.memo}</span>
              <span className="contact-count">
                <b>{pkg.product.contactCount}</b>
                位车主联系过该货源
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="avatar-col">
            <div className="avatar">
              <a href="#" style={{
                backgroundImage: 'url(http://imgsize.ph.126.net/?imgurl=http://img2.ph.126.net/Bxuv7RNkBKTwug5oISbHZw==/6631311857283249341.jpg_188x188x1.jpg)',
                backgroundSize: 'cover'
              }}></a>
            </div>
          </div>
          <div className="account-col">
            <span>{pkg.providerUserName}</span>
            <i className="certified-tag flag teal off">实</i>
            <i className="certified-tag flag orange">公</i>
          </div>
          <div className="follow-status-col">
            <span
              className="followed">
              <i className="icon icon-correct s20"></i>
              <span><b>已关注</b></span>
            </span>
          </div>
        </div>
        <div className="fixed-holder"></div>
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
