import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/global/layout.less';
import '../../../less/component/cell-form.less';
import '../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
// import Promise from 'promise';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import EventListener from 'fbjs/lib/EventListener';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import FixedHolder from '../../fixed-holder/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import DemoActionSheet from '../demo-action-sheet/';
import WXVerify from '../../helper/wx';
import WX from '../../const/wx';

import AH from '../../helper/ajax';
import Validator from '../../helper/validator';
import ShopFaceDemoPng from '../../../img/app/mentouzhao@3x.png';
import BizLicenseDemoPng from '../../../img/app/yingyezhizhao@3x.png';
import BizCardDemoPng from '../../../img/app/mingpingzhao@3x.png';

import {CompanyCertify, CompanyCertifyStatus} from '../model/';

const COMPANY_CERTIFY_DRAFT = 'company_certify_draft';

@FieldChangeEnhance
export default class CompanyCertifyPage extends Component {
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

    EventListener.listen(window, 'beforeunload', () => {
      localStorage.setItem(COMPANY_CERTIFY_DRAFT, JSON.stringify(this.getData()))
    });
  }

  readFromLocal() {
    let TMP_DATA = JSON.parse(localStorage.getItem(COMPANY_CERTIFY_DRAFT));
    if (TMP_DATA) {
      this.setState({
        bizCardPic: TMP_DATA.bizCardPic,
        shopFacePic: TMP_DATA.shopFacePic,
        bizLicensePic: TMP_DATA.bizLicensePic
      });
      this.props.setFields({
        companyName: TMP_DATA.companyName,
        companyPos: TMP_DATA.companyPos,
        companyAddr: TMP_DATA.companyAddr
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
    Validator.config(this.refs.poptip);

    this.fetch();
  }

  fetch() {
    this.ah.one(CompanyCertifyStatus, (res) => {
      if (res.auditStatus === 1) {
        location.replace(location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/company-certify-result.html`));
        return;
      }

      if (res.auditStatus === -1 || res.auditStatus === 0) {
        let result = res.userWithCompanyInfo || {};

        this.setState({
          bizCardPic: result.companyAuthorizeUrl,
          shopFacePic: result.companyCertificateNO,
          bizLicensePic: result.companyCertificateUrl,
          auditStatus: res.auditStatus
        });
        this.props.setFields({
          companyName: result.company,
          companyPos: result.jobPosition,
          companyAddr: result.address
        });

        return;
      }

      this.readFromLocal();
    });
  }

  getData() {
    let states = this.state;
    let props = this.props;

    return {
      bizCardPic: states.bizCardPic,
      shopFacePic: states.shopFacePic,
      bizLicensePic: states.bizLicensePic,
      companyName: props.companyName,
      companyPos: props.companyPos,
      companyAddr: props.companyAddr
    };
  }

  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请填写公司名称', props.companyName) &&
      Validator.test('required', '请填写公司地址', props.companyAddr) &&
      Validator.test('required', '请填写公司职位', props.companyPos) &&
      Validator.test('required', '请上传门头照', states.shopFacePic) &&
      Validator.test('required', '请上传营业执照', states.bizLicensePic)
    );
  }

  clearData() {
    localStorage.removeItem(COMPANY_CERTIFY_DRAFT);
    this.setState({
      bizCardPic: null,
      shopFacePic: null,
      bizLicensePic: null
    });
    this.props.setFields({
      companyName: null,
      companyPos: null,
      companyAddr: null
    });
  }

  uploadImage(localId: String) {
    return new Promise((resolve, reject) => {
      wx.uploadImage({
        localId: localId,
        isShowProgressTips: 1,
        success: (res) => {
          resolve(res.serverId);
        }
      });
    });
  }

  transformData(data: Object) {
    return {
      company: data.companyName,
      address: data.companyAddr,
      jobPosition: data.companyPos,
      companyAuthorizeUrlId: data.bizCardPic,
      companyCertificateNOId: data.shopFacePic,
      companyCertificateUrlId: data.bizLicensePic,
      toAudit: 'yes'
    };
  }

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    let data = this.getData();

    this.uploadImage(data.bizCardPic)
      .then(sid => {
        data.bizCardPic = sid;

        return this.uploadImage(data.shopFacePic);
      })
      .then(sid => {
        data.shopFacePic = sid;

        return this.uploadImage(data.bizLicensePic);
      })
      .then(sid => {
        data.bizLicensePic = sid;

        return data;
      })
      .then(this.transformData)
      .then((params) => {
        this.ah.one(CompanyCertify, (res) => {
          if (res.retcode === 0) {
            this.refs.poptip.warn('成功提交公司认证');

            this.clearData();
            setTimeout(() => {
              try {
                WeixinJSBridge.invoke('closeWindow');
              } catch(e) {
                window.close();
              }
            }, 1500);

            return;
          }

          this.refs.poptip.warn(res.msg);
        }, params);
      })
      .catch(() => {
        this.refs.poptip.warn('提交失败');
      });
  }

  showActionSheet(field: Object, pic: String) {
    if (!this.state.wxReady) {
      this.refs.poptip.warn('微信验证中,请稍后重试...');
      return;
    }

    this.refs.demoActionSheet.show({
      img: pic,
      tip: '示例图片',
      ass: [
        {
          name: '拍照',
          handler: () => {
            wx.chooseImage({
              count: 1,
              sizeType: ['original'],
              sourceType: ['camera'],
              success: (res) => {
                var localIds = res.localIds;

                this.setState({
                  [field]: localIds[0]
                });
              }
            });
          }
        }, {
          name: '从相册中选择',
          handler: () => {
            wx.chooseImage({
              count: 1,
              sizeType: ['original'],
              sourceType: ['album'],
              success: (res) => {
                var localIds = res.localIds;

                this.setState({
                  [field]: localIds[0]
                });
              }
            });
          }
        }
      ]
    });
  }

  closeNotice() {
    this.setState({
      noticeClosed: true
    });
  }

  renderStatusText() {
    let statusText;

    switch (this.state.auditStatus) {
      case 0:
        statusText = '公司认证审核中...';
        break;
      case 1:
        statusText = '公司认证失败!';
        break;
    }

    if (statusText) {
      return (
        <div className={cx('notice', this.state.noticeClosed && 'hide' || '')} onClick={this.closeNotice.bind(this)}>
          <b>·</b>
          <span>{statusText}</span>
          <i className="icon close">x</i>
        </div>
      );
    }
  }

  render() {
    let props = this.props;
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
      <section className="company-certify-page">
        {this.renderStatusText()}
        <div className="cells cells-access cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>公司名称</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写"
                value={props.companyName}
                onChange={props.handleStrChange.bind(this, 'companyName')}
              />
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
              <input
                type="text"
                className="input"
                placeholder="填写"
                value={props.companyAddr}
                onChange={props.handleStrChange.bind(this, 'companyAddr')}
              />
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
              <input
                type="text"
                className="input"
                placeholder="填写"
                value={props.companyPos}
                onChange={props.handleStrChange.bind(this, 'companyPos')}
              />
            </div>
            <div className="cell-ft"></div>
          </div>

          <div className="cell" onClick={this.showActionSheet.bind(this, 'bizCardPic', BizCardDemoPng)}>
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
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'shopFacePic', ShopFaceDemoPng)}>
            <div className="cell_hd">
              <label className="label">
                <span>门头照</span>
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
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'bizLicensePic', BizLicenseDemoPng)}>
            <div className="cell_hd">
              <label className="label">
                <span>营业执照</span>
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
        </div>
        <FixedHolder height="70" />
        <button
          className="btn block teal bottom-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >
          提交认证
        </button>
        <DemoActionSheet ref="demoActionSheet" />
        <Poptip ref="poptip" />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<CompanyCertifyPage />, document.querySelector('.page'));
