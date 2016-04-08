import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/global/layout.less';
import '../../../less/component/cell-form.less';
import '../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';
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

import {CompanyCertify} from '../model/';

const COMPANY_CERTIFY_DRAFT = 'company_certify_draft';

@FieldChangeEnhance
export default class TruckerCertifyPage extends Component {
  state = {
    maxBizDescLength: 80
  };

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
    let states = this.states;

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

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    this.ah.one(RealNameCertify, (res) => {
      this.refs.poptip.show('成功提交公司认证');
      this.clearData();
      setTimeout(history.back, 1500);
    }, this.getData());
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
                alert(JSON.stringify(localIds));

                this.setState({
                  [field]: localIds
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
                alert(JSON.stringify(localIds));

                this.setState({
                  [field]: localIds
                });
              }
            });
          }
        }
      ]
    });
  }

  render() {
    let props = this.props;

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
                  <i className="icon icon-credentials s25"></i>
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
                  <i className="icon icon-credentials s25"></i>
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
                  <i className="icon icon-credentials s25"></i>
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

ReactDOM.render(<TruckerCertifyPage />, document.querySelector('.page'));
