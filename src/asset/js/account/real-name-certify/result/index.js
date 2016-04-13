import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import '../../../../less/global/layout.less';
import '../../../../less/component/cell-form.less';
import '../../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';
import cx from 'classnames';
import assign from 'lodash/object/assign';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';
import FixedHolder from '../../../fixed-holder/';
import WXVerify from '../../../helper/wx';
import WX from '../../../const/wx';
import AH from '../../../helper/ajax';
import {RealNameCertifyStatus} from '../../model/';

export default class RealNameCertifyResultPage extends Component {
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
    this.ah.one(RealNameCertifyStatus, (res) => {
      let result = res.loggedUser;

      this.setState({
        avatar: result.FaceImgUrl,
        idCardPic: result.IdentityImgUrl,
        realName: result.identityName,
        idCardNo: result.identityID,
        addr: result.identityAddress,
        bizDesc: result.description,
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

    let avatar = states.avatar ? (
      <i className="icon s25" style={{
        backgroundImage: `url(${states.avatar})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    let idCardPic = states.idCardPic ? (
      <i className="icon s25" style={{
        backgroundImage: `url(${states.idCardPic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    return (
      <section className="real-name-certify-result-page">
        <div className="cells cells-access cells-form">
          <div className="cell required" onClick={this.takeAvatar.bind(this)}>
            <div className="cell_hd">
              <label className="label">
                <span>头像</span>
              </label>
            </div>
            <div className="cell-bd cell_primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {avatar}
                </div>
              </div>
            </div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>姓名</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.realName ? 'val' : 'holder'}>{states.realName}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>身份证号</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.idCardNo ? 'val' : 'holder'}>{states.idCardNo}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required" onClick={this.showImg.bind(this, 'idCardPic')}>
            <div className="cell_hd">
              <label className="label">
                <span>身份证照</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
            </div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  {idCardPic}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cells cells-access cells-form">
          <div className="cell">
            <div className="cell_hd">
              <label className="label">
                <span>地区</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.addr ? 'val' : 'holder'}>{states.addr}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell">
            <div className="cell_hd">
              <label className="label">
                <span>业务介绍</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <p className={states.bizDesc ? 'val' : 'holder'}>{states.bizDesc}</p>
            </div>
            <div className="cell-ft"></div>
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

ReactDOM.render(<RealNameCertifyResultPage />, document.querySelector('.page'));
