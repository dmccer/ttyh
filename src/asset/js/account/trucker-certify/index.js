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
import {SelectTruckTypeEnhance} from '../../enhance/select-truck-type';
import DemoActionSheet from '../demo-action-sheet/';
import WXVerify from '../../helper/wx';
import WX from '../../const/wx';
import AH from '../../helper/ajax';
import Validator from '../../helper/validator';
import {TruckerCertify} from '../model/';
import {DrivingLicenseDemoPng} from '../../../img/app/jiashizhengzhao@3x.png';
import {RoadLicenseDemoPng} from '../../../img/app/xingshizhengzhao@3x.png';
import {TruckDemoPng} from '../../../img/app/cheliangzhao@3x.png';

const TRUCKER_CERTIFY_DRAFT = 'trucker_certify_draft';

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class TruckerCertifyPage extends Component {
  state = {
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
      localStorage.setItem(TRUCKER_CERTIFY_DRAFT, JSON.stringify(this.getData()))
    });

    let TMP_DATA = JSON.parse(localStorage.getItem(TRUCKER_CERTIFY_DRAFT));
    if (TMP_DATA) {
      this.setState({
        drivingLicensePic: TMP_DATA.drivingLicensePic,
        roadLicensePic: TMP_DATA.roadLicensePic,
        truckPic: TMP_DATA.truckPic
      });
      this.props.setFields({
        licensePlate: TMP_DATA.licensePlate,
        truckType: TMP_DATA.truckType,
        truckLength: TMP_DATA.truckLength,
        loadLimit: TMP_DATA.loadLimit
      });
    }
  }

  omponentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
    Validator.config(this.refs.poptip);
  }

  getData() {
    let states = this.state;
    let props = this.props;

    return {
      drivingLicensePic: states.drivingLicensePic,
      roadLicensePic: states.roadLicensePic,
      truckPic: states.truckPic,
      licensePlate: props.licensePlate,
      truckType: props.truckType,
      truckLength: props.truckLength,
      loadLimit: props.loadLimit
    };
  }

  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请填写车牌号', props.licensePlate) &&
      Validator.test('required', '请选择车型', props.truckType && props.truckType.id) &&
      Validator.test('required', '请选择车长', props.truckLength && props.truckLength.id) &&
      Validator.test('required', '请填写载重', props.loadLimit) &&
      Validator.test('required', '请上传驾驶证照片', states.drivingLicensePic) &&
      Validator.test('required', '请上传行驶证照片', states.roadLicensePic) &&
      Validator.test('required', '请上传车辆照片', states.truckPic)
    );
  }

  clearData() {
    localStorage.removeItem(TRUCKER_CERTIFY_DRAFT);
    this.setState({
      drivingLicensePic: null,
      roadLicensePic: null,
      truckPic: null,
    });
    this.props.setFields({
      licensePlate: null,
      loadLimit: null
    });
    this.props.setSelectTruckTypeData({
      truckType: {},
      truckLength: {},
    });
  }

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    this.ah.one(TruckerCertify, (res) => {
      this.refs.poptip.show('成功提交实名认证');
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
    let truckType = props.truckType;
    let truckLength = props.truckLength;
    let truckDesc = truckType && truckType.name ? `${truckType.name} ${truckLength && truckLength.name || ''}` : null;

    return (
      <section className="trucker-certify-page">
        <div className="cells cells-access cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>车牌号</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写"
                value={props.license}
                onChange={props.handleStrChange.bind(this, 'license')}
              />
            </div>
            <div className="cell-ft"></div>
          </div>
          <div
            className="cell required"
            onClick={props.handleSelectTruckType.bind(this)}>
            <div className="cell_hd">
              <label className="label">车型</label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={truckDesc ? 'val' : 'holder'}>{truckDesc || '选择'}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required unit">
            <div className="cell_hd">
              <label className="label">
                <span>载重</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写"
                value={props.loadLimit}
                onChange={props.handleFloatChange.bind(this, 'loadLimit')}
              />
            </div>
            <div className="cell-ft">吨</div>
          </div>
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'drivingLicensePic', DrivingLicenseDemoPng)}>
            <div className="cell_hd">
              <label className="label">
                <span>驾驶证</span>
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
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'roadLicensePic', RoadLicenseDemoPng)}>
            <div className="cell_hd">
              <label className="label">
                <span>行驶证</span>
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
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'truckPic', TruckDemoPng)}>
            <div className="cell_hd">
              <label className="label">
                <span>车辆照</span>
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
