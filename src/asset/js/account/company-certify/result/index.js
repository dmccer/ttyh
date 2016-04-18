import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import '../../../../less/global/layout.less';
import '../../../../less/component/cell-form.less';
import '../../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';
import FixedHolder from '../../../fixed-holder/';
import WXVerify from '../../../helper/wx';
import WX from '../../../const/wx';
import AH from '../../../helper/ajax';
import {CompanyCertifyStatus} from '../../model/';

export default class CompanyCertifyResultPage extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    WXVerify({
      url: WX.url,
      appId: WX.appId,
      jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
    }, (err) => {
      if (err) {
        this.refs.poptip.warn('微信验证失败');
        return;
      }

      this.setState({
        wxReady: true
      });
    });
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.fetch();
  }

  fetch() {
    this.ah.one(CompanyCertifyStatus, (res) => {
      let result = res.userWithCompanyInfo;

      this.setState({
        bizCardPic: result.companyAuthorizeUrl,
        shopFacePic: result.companyCertificateNO,
        bizLicensePic: result.companyCertificateUrl,
        companyName: result.company,
        companyAddr: result.address,
        companyPos: result.jobPosition,
        auditStatus: res.auditStatus
      });
    });
  }

  showImg(field: String) {
    if (!this.state.wxReady) {
      this.refs.poptip.warn('等待微信验证...');
      return;
    }

    let states = this.state;

    wx.previewImage({
      current: states[field],
      urls: [states[field]]
    });
  }

  renderCertifyStatus() {
    let statusText;

    switch(this.state.auditStatus) {
      case 0:
        statusText = '审核中...';
        break;
      case 1:
        statusText = '已通过认证';
        break;
    }

    return (
      <button
        className="btn block teal bottom-btn"
        type="button"
        disabled="true"
      >
        {statusText}
      </button>
    );
  }

  render() {
    let states = this.state;

    let bizCardPic = states.bizCardPic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.bizCardPic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let bizLicensePic = states.bizLicensePic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.bizLicensePic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let shopFacePic = states.shopFacePic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.shopFacePic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    return (
      <section className="trucker-certify-page">
        <div className="cells cells-access cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>公司名称</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.companyName ? 'val' : 'holder'}>{states.companyName}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>公司地址</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.companyAddr ? 'val' : 'holder'}>{states.companyAddr}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>职位</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.companyPos ? 'val' : 'holder'}>{states.companyPos}</p>
            </div>
            <div className="cell-ft"></div>
          </div>

          <div className="cell" onClick={this.showImg.bind(this, 'bizCardPic')}>
            <div className="cell_hd">
              <label className="label">
                <span>名片</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {bizCardPic}
                </div>
              </div>
            </div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'shopFacePic')}>
            <div className="cell_hd">
              <label className="label">
                <span>门头照</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {bizLicensePic}
                </div>
              </div>
            </div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'bizLicensePic')}>
            <div className="cell_hd">
              <label className="label">
                <span>营业执照</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {shopFacePic}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderCertifyStatus()}
        <FixedHolder height="70" />
        <Poptip ref="poptip" />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<CompanyCertifyResultPage />, document.querySelector('.page'));
