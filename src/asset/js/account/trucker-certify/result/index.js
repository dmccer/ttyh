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
import {TruckerCertifyStatus} from '../../model/';

export default class TruckerCertifyResultPage extends Component {
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
    this.ah.one(TruckerCertifyStatus, (res) => {
      let result = res.truckInfo || {};

      this.setState({
        drivingLicensePic: result.driverLicenseImgUrl,
        roadLicensePic: result.drivingLicenseImgUrl,
        truckPic: result.bizLicenseImgUrl,
        licensePlate: result.licensePlate,
        truckType: result.truckTypeStr,
        truckLength: result.truckLength,
        loadLimit: result.loadLimit,
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

    let drivingLicensePic = states.drivingLicensePic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.drivingLicensePic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let roadLicensePic = states.roadLicensePic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.roadLicensePic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let truckPic = states.truckPic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.truckPic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let truckDesc = `${states.truckType || ''} ${states.truckLength && (states.truckLength + '米') || ''}`;

    return (
      <section className="trucker-certify-page">
        <i className="icon s80 icon-certified"></i>
        <div className="cells cells-access cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>车牌号</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.licensePlate ? 'val' : 'holder'}>{states.licensePlate}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">车型</label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={truckDesc ? 'val' : 'holder'}>{truckDesc}</p>
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
              <p className={states.loadLimit ? 'val' : 'holder'}>{states.loadLimit}</p>
            </div>
            <div className="cell-ft">吨</div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'drivingLicensePic')}>
            <div className="cell_hd">
              <label className="label">
                <span>驾驶证</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {drivingLicensePic}
                </div>
              </div>
            </div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'roadLicensePic')}>
            <div className="cell_hd">
              <label className="label">
                <span>行驶证</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {roadLicensePic}
                </div>
              </div>
            </div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'truckPic')}>
            <div className="cell_hd">
              <label className="label">
                <span>车辆照</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {truckPic}
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

ReactDOM.render(<TruckerCertifyResultPage />, document.querySelector('.page'));
