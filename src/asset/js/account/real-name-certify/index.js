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
import CitySelector from '../../city-selector/';
import IDCardDemoPng from '../../../img/app/shenfenzhengzhao@3x.png';
import {RealNameCertify} from '../model/';

const REAL_NAME_CERTIFY_DRAFT = 'real_name_certify_draft';

@FieldChangeEnhance
export default class RealNameCertifyPage extends Component {
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
      localStorage.setItem(REAL_NAME_CERTIFY_DRAFT, JSON.stringify(this.getData()))
    });

    let TMP_DATA = JSON.parse(localStorage.getItem(REAL_NAME_CERTIFY_DRAFT));
    if (TMP_DATA) {
      this.setState({
        avatar: TMP_DATA.avatar,
        idCardPic: TMP_DATA.idCardPic
      });
      this.props.setFields({
        realName: TMP_DATA.realName,
        idCardNo: TMP_DATA.idCardNo,
        addr: TMP_DATA.addr,
        bizDesc: TMP_DATA.bizDesc
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
      avatar: states.avatar,
      idCardPic: states.idCardPic,
      realName: props.realName,
      idCardNo: props.idCardNo,
      addr: props.addr,
      bizDesc: props.bizDesc
    };
  }

  validate() {
    return (
      Validator.test('required', '请上传头像', this.state.avatar) &&
      Validator.test('required', '请填写姓名', this.props.realName) &&
      Validator.test('required', '请填写身份证号', this.props.idCardNo) &&
      Validator.test('required', '请上传身份证照片', this.state.idCardPic)
    );
  }

  clearData() {
    localStorage.removeItem(REAL_NAME_CERTIFY_DRAFT);
    this.setState({
      avatar: null,
      idCardPic: null
    });
    this.props.setFields({
      realName: null,
      idCardNo: null,
      addr: null,
      bizDesc: null
    });
  }

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    this.ah.one(RealNameCertify, (res) => {
      this.refs.poptip.show('成功提交实名认证');
      this.clearData();
      setTimeout(history.back, 1500);
    }, this.getData());
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
        alert(JSON.stringify(localIds));

        this.setState({
          avatar: localIds
        });
      }
    });
  }

  handleClickSelectCity() {
    this.refs.citySelector.show(0, 2, false);
  }

  handleSelectCityDone(province, city) {
    if (province) {
      this.setState({
        addr: `${province} ${city || ''}`
      });
    }
  }

  closeNotice() {
    this.setState({
      noticeClosed: true
    });
  }

  render() {
    let props = this.props;

    return (
      <section className="real-name-certify-page">
        <div className={cx('notice', this.state.noticeClosed && 'hide' || '')} onClick={this.closeNotice.bind(this)}>
          <b>·</b>
          <span>实名认证可以提升信任度!</span>
          <i className="icon close">x</i>
        </div>

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
                  <i className="icon icon-account off s25"></i>
                  <p>真实头像</p>
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
            <div className="cell-bd cell_primary">
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
            <div className="cell-bd cell_primary">
            </div>
            <div className="cell-ft">
              <div className="pic-holder row">
                <div>
                  <i className="icon icon-credentials s25"></i>
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
            <div className="cell-bd cell_primary">
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
            <div className="cell-bd cell_primary">
              <textarea
                className="textarea"
                placeholder="我有17米平板车一辆，常跑上海到武汉；或者长期货源，广州到深圳，家具。"
                value={props.bizDesc}
                onChange={props.handleLimitStrChange.bind(this, 'bizDesc', 80)}>
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
