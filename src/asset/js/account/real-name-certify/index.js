import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/global/layout.less';
import '../../../less/component/cell-form.less';
import '../../../less/component/icon.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import EventListener from 'fbjs/lib/EventListener';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import FixedHolder from '../../fixed-holder/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import DemoActionSheet from '../demo-action-sheet/';
import WXVerify from '../../helper/wx';
import WX from '../../const/wx';
import AH from '../../helper/ajax';
import Validator from '../../helper/validator';
import CitySelector from '../../city-selector/';
import IDCardDemoPng from '../../../img/app/shenfenzhengzhao@3x.png';
import {RealNameCertify, RealNameCertifyStatus} from '../model/';

injectTapEventPlugin();

const REAL_NAME_CERTIFY_DRAFT = 'real_name_certify_draft';
const ALL = '全部';

@FieldChangeEnhance
export default class RealNameCertifyPage extends Component {
  state = {
    maxBizDescLength: 80,
    qs: querystring.parse(location.search.substring(1))
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
      localStorage.setItem(REAL_NAME_CERTIFY_DRAFT, JSON.stringify(this.getData()))
    });
  }

  readFromLocal() {
    let TMP_DATA = JSON.parse(localStorage.getItem(REAL_NAME_CERTIFY_DRAFT));
    if (TMP_DATA) {
      this.setState({
        avatar: TMP_DATA.avatar,
        idCardPic: TMP_DATA.idCardPic,
        addr: TMP_DATA.addr
      });
      this.props.setFields({
        realName: TMP_DATA.realName,
        idCardNo: TMP_DATA.idCardNo,
        bizDesc: TMP_DATA.bizDesc
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
    Validator.config(this.refs.poptip);

    this.fetch();
  }

  fetch() {
    this.ah.one(RealNameCertifyStatus, (res) => {
      if (res.auditStatus === 1) {
        location.replace(location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/real-name-certify-result.html`));
        return;
      }

      if (res.auditStatus === -1 || res.auditStatus === 0) {
        let userVerify = res.userVerify || {};
        let user = res.loggedUser;

        this.setState({
          avatar: userVerify.faceImgUrl,
          idCardPic: userVerify.identityImgUrl,
          addr: userVerify.identityAddress,
          auditStatus: res.auditStatus
        });
        this.props.setFields({
          realName: userVerify.identityName,
          idCardNo: userVerify.identityID,
          bizDesc: user.description
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
      avatar: states.avatar,
      idCardPic: states.idCardPic,
      realName: props.realName,
      idCardNo: props.idCardNo,
      addr: states.addr,
      bizDesc: props.bizDesc
    };
  }

  validate() {
    return (
      Validator.test('required', '请上传本人正面照', this.state.avatar) &&
      Validator.test('required', '请填写姓名', this.props.realName) &&
      Validator.test('required', '请填写身份证号', this.props.idCardNo) &&
      Validator.test('idCard', '请填写正确的身份证号', this.props.idCardNo) &&
      Validator.test('required', '请上传身份证照片', this.state.idCardPic)
    );
  }

  clearData() {
    localStorage.removeItem(REAL_NAME_CERTIFY_DRAFT);
    this.setState({
      avatar: null,
      idCardPic: null,
      addr: null
    });
    this.props.clearAll();
    this.props.setFields({
      bizDesc: ''
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
      identityName: data.realName,
      identityAddress: data.addr,
      identityID: data.idCardNo,
      IdentityImgUrlId: data.idCardPic,
      FaceImgUrlId: data.avatar,
      description: data.bizDesc,
      toAudit: 'yes'
    };
  }

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    let data = this.getData();

    this.uploadImage(data.avatar)
      .then(sid => {
        data.avatar = sid;

        return this.uploadImage(data.idCardPic);
      })
      .then(sid => {
        data.idCardPic = sid;

        return data;
      })
      .then(this.transformData)
      .then((params) => {
        this.ah.one(RealNameCertify, (res) => {
          if (res.retcode === 0) {
            this.refs.poptip.warn('成功提交实名认证');

            this.clearData();

            setTimeout(() => {
              if (this.state.qs.ref) {
                location.replace(this.state.qs.ref);

                return;
              }

              history.back();

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

  showActionSheet(field: Object) {
    if (!this.state.wxReady) {
      this.refs.poptip.warn('微信验证中,请稍后重试...');
      return;
    }

    this.refs.demoActionSheet.show({
      img: IDCardDemoPng,
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
                }, this.writeDraft.bind(this));
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
                }, this.writeDraft.bind(this));
              }
            });
          }
        }
      ]
    });
  }

  takeAvatar() {
    if (!this.state.wxReady) {
      this.refs.poptip.warn('微信验证中,请稍后重试...');
      return;
    }

    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        var localIds = res.localIds;

        this.setState({
          avatar: localIds[0]
        }, this.writeDraft.bind(this));
      }
    });
  }

  handleClickSelectCity() {
    this.refs.citySelector.show(0, 2, false);
  }

  handleSelectCityDone(province, city) {
    if (province === ALL) {
      return;
    }

    if (province) {
      this.setState({
        addr: `${province} ${city !== ALL && city || ''}`
      }, this.writeDraft.bind(this));
    }
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
        statusText = '实名认证审核中...';
        break;
      case 1:
        statusText = '实名认证失败!';
        break;
      default:
        statusText = '实名认证可以提升信任度!';
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

  writeDraft() {
    localStorage.setItem(REAL_NAME_CERTIFY_DRAFT, JSON.stringify(this.getData()))
  }

  render() {
    let props = this.props;
    let states = this.state;

    let avatar = states.avatar ? (
      <div>
        <i className="icon pic" style={{
          backgroundImage: `url(${states.avatar})`
        }}></i>
      </div>
    ) : (
      <div>
        <i className="icon icon-account off s25"></i>
        <p>本人正面照</p>
      </div>
    );

    let idCardPic = states.idCardPic ? (
      <i className="icon pic" style={{
        backgroundImage: `url(${states.idCardPic})`
      }}></i>
    ) : (<i className="icon icon-credentials s25"></i>);

    return (
      <section className="real-name-certify-page">
        {this.renderStatusText()}
        <div className="cells cells-access cells-form">
          <div className="cell required" onClick={this.takeAvatar.bind(this)}>
            <div className="cell_hd">
              <label className="label">
                <span>本人正面照</span>
              </label>
            </div>
            <div className="cell-bd cell-primary"></div>
            <div className="cell-ft">
              <div className="pic-holder row">
                {avatar}
              </div>
            </div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>姓名</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
              <input
                type="text"
                className="input"
                placeholder="填写姓名"
                value={props.realName}
                onChange={props.handleStrChange.bind(this, 'realName')}
              />
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>身份证号</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
              <input
                type="text"
                className="input"
                placeholder="填写身份证号"
                value={props.idCardNo}
                onChange={props.handleStrChange.bind(this, 'idCardNo')}
              />
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required" onClick={this.showActionSheet.bind(this, 'idCardPic')}>
            <div className="cell_hd">
              <label className="label">
                <span>身份证照</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
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
          <div className="cell" onClick={this.handleClickSelectCity.bind(this)}>
            <div className="cell_hd">
              <label className="label">
                <span>地区</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
              <p className={this.state.addr ? 'val' : 'holder'}>{this.state.addr || '选填'}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell">
            <div className="cell_hd">
              <label className="label">
                <span>业务介绍</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
              <textarea
                className="textarea"
                placeholder="我有17米平板车一辆，常跑上海到武汉；或者长期货源，广州到深圳，家具。"
                value={props.bizDesc}
                onChange={props.handleLimitStrChange.bind(this, 'bizDesc', this.state.maxBizDescLength, this.writeDraft.bind(this))}>
              </textarea>
              <span className="char-limit">{props.bizDesc && props.bizDesc.length || 0} / {this.state.maxBizDescLength}</span>
            </div>
            <div className="cell-ft"></div>
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
        <CitySelector
          ref="citySelector"
          done={this.handleSelectCityDone.bind(this)}
        />
      </section>
    );
  }
}

ReactDOM.render(<RealNameCertifyPage />, document.querySelector('.page'));
