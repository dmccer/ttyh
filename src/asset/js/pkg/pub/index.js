/**
 * 发布货源页面 ./pkg-pub.html
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';
import injectTapEventPlugin from 'react-tap-event-plugin';

import $ from '../../helper/z';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Log from '../../log/';
import Selector from '../../selector/';
import CitySelector from '../../city-selector/';
import DatePicker from '../../datepicker/';
import FixedHolder from '../../fixed-holder/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import DT from '../../helper/date';
import Validator from '../../helper/validator';
import AH from '../../helper/ajax';
import {OrderedEnumValue} from '../../model/';
import {PubPkg} from '../model/';
import {
  PKG_DRAFT, PKG_INFO_DATA,
  PKG_MEMO,
  PAGE_TYPE, PKG_TRUCK_USE_DATA,
  JUST_SELECT_TRUCK_TYPE, DEFAULT_LOAD_TYPE_ID,
  DEFAULT_PAYMENT_TYPE_ID
} from '../../const/pkg';
import {TIME_AREAS} from '../../const/time-area';

const ALL = '全部';
const TMP_DATA = JSON.parse(localStorage.getItem(PKG_DRAFT));

injectTapEventPlugin();

@FieldChangeEnhance
export default class PkgPubPage extends React.Component {
  static defaultProps = (() => {
    let r = {};

    if (!TMP_DATA) {
      return r;
    }

    ['detailFromCity', 'detailToCity'].forEach(key => {
      r[key] = TMP_DATA[key];
    });

    return r;
  })();

  state = {
    qs: querystring.parse(location.search.substring(1)),
    memo: localStorage.getItem(PKG_MEMO) || '',
    timeAreas: [],
    loadTypes: [],
    paymentTypes: [],
    loadType: {},
    paymentType: {}
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (TMP_DATA) {
      let r = {};

      [
        'entruckTime', 'fromCity', 'toCity',
        'loadType', 'paymentType', 'timeArea'
      ].forEach(key => {
        if (TMP_DATA[key]) {
          r[key] = TMP_DATA[key];
        }
      });

      this.setState(r);
    }

    let TMP_PIDATA = JSON.parse(localStorage.getItem(PKG_INFO_DATA));
    if (TMP_PIDATA) {
      let volumeStr = TMP_PIDATA.pkgVolume ? `${TMP_PIDATA.pkgVolume}方` : '';
      this.setState({
        pkgInfo: TMP_PIDATA,
        pkgInfoDesc: `${TMP_PIDATA.pkgName || ''} ${TMP_PIDATA.pkgWeight ? (TMP_PIDATA.pkgWeight + '吨') : ''} ${volumeStr} ${TMP_PIDATA.packManner.name || ''}${TMP_PIDATA.pkgCount ? ('*' + TMP_PIDATA.pkgCount) : ''}`
      });
    }

    let TMP_TUDATA = JSON.parse(localStorage.getItem(PKG_TRUCK_USE_DATA));
    if (TMP_TUDATA) {
      let size = TMP_TUDATA.truckUseType.id === JUST_SELECT_TRUCK_TYPE ? `${TMP_TUDATA.stallSize}米` : TMP_TUDATA.truckLength.name;
      this.setState({
        truckUseInfo: TMP_TUDATA,
        truckUseInfoDesc: `${TMP_TUDATA.truckUseType.name || ''} ${TMP_TUDATA.truckType.name || ''} ${size || ''}`
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
    Validator.config(this.refs.poptip);

    this.getEnums();
  }

  getEnums() {
    this.ah.all([OrderedEnumValue, OrderedEnumValue], (res) => {
      let loadTypes = res[0].loadingTypeMap.map(item => {
        return {
          name: item.value,
          id: item.key
        };
      });
      let paymentTypes = res[1].payTypeMap.map(item => {
        return {
          name: item.value,
          id: item.key
        };
      });

      let loadType = this.state.loadType;
      let paymentType = this.state.paymentType;

      if (this.state.loadType.id == null) {
        loadType = find(loadTypes, item => {
          return DEFAULT_LOAD_TYPE_ID === item.id;
        });
      }
      if (this.state.paymentType.id == null) {
        paymentType = find(paymentTypes, item => {
          return DEFAULT_PAYMENT_TYPE_ID === item.id
        });
      }

      this.setState({
        loadTypes: loadTypes,
        paymentTypes: paymentTypes,
        loadType: loadType,
        paymentType: paymentType
      });
    }, ['loadingType'], ['payType']);
  }

  /**
   * 处理提交发布
   * @param  {SubmitEvent} e
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.validate()) {
      return;
    }

    _hmt.push(['_trackEvent', '货源', '发布', new Date().toLocaleString()]);

    let props = this.props;
    let states = this.state;

    this.ah.one(PubPkg, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(`发布货源失败,${res.msg}`);

          return;
        }

        _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布成功', 2]);

        this.refs.poptip.success('发布货源成功');

        // 清空发布货源草稿及页面数据
        localStorage.removeItem(PKG_DRAFT);
        localStorage.removeItem(PKG_MEMO);
        localStorage.removeItem(PKG_INFO_DATA);
        localStorage.removeItem(PKG_TRUCK_USE_DATA);
        this.clearData();

        setTimeout(() => {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/my-pkg.html?' + querystring.stringify(this.state.qs));
        }, 1500);
      },
      error: () => {
        _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布失败', 2]);

        this.refs.poptip.error('发布货源失败');
      }
    }, {
      loadProTime: `${states.entruckTime} ${states.timeArea.name}`,
      fromCity: states.fromCity,
      toCity: states.toCity,
      fromAddr: props.detailFromCity,
      toAddr: props.detailToCity,
      payType: states.paymentType.id,
      loadingType: states.loadType.id,

      useType: states.truckUseInfo.truckUseType && states.truckUseInfo.truckUseType.id,
      truckType: states.truckUseInfo.truckType && states.truckUseInfo.truckType.id,
      truckLength: states.truckUseInfo.truckLength && states.truckUseInfo.truckLength.id,
      spaceNeeded: states.truckUseInfo.stallSize,

      productName: states.pkgInfo.pkgName,
      title: states.pkgInfo.pkgName,
      productVolume: states.pkgInfo.pkgVolume,
      packType: states.pkgInfo.packManner && states.pkgInfo.packManner.id,
      productCount: states.pkgInfo.pkgCount,
      loadLimit: states.pkgInfo.pkgWeight,

      memo: this.state.memo
    });
  }

  clearData() {
    this.setState({
      entruckTime: null,
      timeArea: null,
      fromCity: null,
      toCity: null,
      detailFromCity: null,
      detailToCity: null,
      paymentType: {},
      loadingType: {}
    });
  }

  /**
   * 校验必填字段
   */
  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请选择装车日期', states.entruckTime) &&
      Validator.test('required', '请选择装车时间段', states.timeArea) &&
      Validator.test('required', '请选择出发地址', states.fromCity) &&
      Validator.test('required', '请选择到达地址', states.toCity) &&
      Validator.test('required', '请填写货物名称', states.pkgInfo && states.pkgInfo.pkgName) &&
      Validator.test('required', '请填写货物重量', states.pkgInfo && states.pkgInfo.pkgWeight) &&
      Validator.test('required', '请选择货物包装', states.pkgInfo && states.pkgInfo.packManner.id) &&
      Validator.test('required', '请选择用车类型', states.truckUseInfo && states.truckUseInfo.truckUseType.id) &&
      (
        Validator.test('required', '请选择用车车长或占用车位', states.truckUseInfo && states.truckUseInfo.truckLength && states.truckUseInfo.truckLength.id) ||
        Validator.test('required', '请选择用车车长或占用车位', states.truckUseInfo && states.truckUseInfo.stallSize)
      )
    );
  }

  /**
   * 写入草稿
   */
  writeDraft() {
    let props = this.props;
    let states = this.state;

    localStorage.setItem(PKG_DRAFT, JSON.stringify({
      entruckTime: states.entruckTime,
      timeArea: states.timeArea,
      fromCity: states.fromCity,
      toCity: states.toCity,
      detailFromCity: props.detailFromCity,
      detailToCity: props.detailToCity,
      loadType: states.loadType,
      paymentType: states.paymentType
    }));
  }

  /**
   * 打开/关闭地址选择器
   * @param  {String} field 字段名, fromCity(出发地)或toCity(到达地)
   * @param  {ClickEvent} e
   */
  toggleCitySelector(field, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let state = this.state;
    let cs = this.refs.citySelector;
    let top = this.getCitySelectorTop(this.refs[`${field}Field`]);
    this.setState({
      citySelectorField: field
    });

    if (field === state.citySelectorField) {
      if (state.showCitySelector) {
        cs.clear();
        cs.close();

        return;
      }
      cs.show();

      return;
    }

    cs.clear();
    cs.show(top);
  }

  getCitySelectorTop(target) {
    let offset = $.offset(target);

    return offset.top + offset.height - 1;
  }

  /**
   * 处理选择省份
   * @param  {String} province 省份
   */
  handleSelectProvince(province) {
    if (province === ALL) {
      // 清空之前选的值
      province = null;
    }

    this.setState({
      [this.state.citySelectorField]: province
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 处理选择城市
   * @param  {String} city 城市
   */
  handleSelectCity(city) {
    if (city === ALL) {
      return;
    }

    let field = this.state.citySelectorField;

    this.setState({
      [field]: `${this.state[field]}-${city}`
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 处理选择地区
   * @param  {String} area 地区
   */
  handleSelectArea(area) {
    if (area === ALL) {
      return;
    }

    let field = this.state.citySelectorField;

    this.setState({
      [field]: `${this.state[field]}-${area}`
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 处理选择历史地址
   * @param  {Array} args [省份, 城市, 地区]
   */
  handleSelectHistory(...args) {
    let selected = args.filter((arg) => {
      return !!arg;
    });

    this.setState({
      [this.state.citySelectorField]: selected.join('-')
    }, () => {
      this.writeDraft();
    });
  }

  handleCloseCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  handleShowCitySelector() {
    this.setState({
      showCitySelector: true
    });
  }

  handleCancelCitySelector(province, city, area) {
    if (province) {
      this.refs.citySelector.writeHistory2Local({
        province: province,
        city: city == ALL ? null : city,
        area: area == ALL ? null : area
      });
    }
  }

  handleSelectDate(d) {
    let r;

    if (DT.isToday(d)) {
      let h = new Date().getHours();
      r = TIME_AREAS.map((timeArea, index) => {
        return {
          name: timeArea.name,
          id: timeArea.id,
          disabled: !timeArea.test(h)
        };
      });
    } else {
      r = assign([], TIME_AREAS);
    }

    this.setState({
      entruckTime: DT.format(d),
      timeAreas: r
    }, () => {
      this.refs.dateAreaSelector.show();
      this.writeDraft();
    });
  }

  handleSelectTimeArea(v) {
    this.setState({
      timeArea: v
    }, this.writeDraft.bind(this));
  }


  handleClickSelectLoadType() {
    this.refs.loadTypeSelector.show();
  }

  handleSelectLoadType(v) {
    this.setState({
      loadType: v
    }, this.writeDraft.bind(this));
  }

  handleClickSelectPaymentType() {
    this.refs.paymentTypeSelector.show();
  }

  handleSelectPaymentType(v) {
    this.setState({
      paymentType: v
    }, this.writeDraft.bind(this));
  }

  /**
   * 若有 memo, 则展示 memo, 并高亮，
   * 若无 memo, 则模拟 placeholder
   */
  renderMemo() {
    if (this.state.memo) {
      return (
        <a href="./pkg-pub-memo.html" className="input-holder on">{this.state.memo}</a>
      );
    }

    return (
      <a href="./pkg-pub-memo.html" className="input-holder">请填写注意事项等</a>
    );
  }

  render() {
    let props = this.props;
    let states = this.state;

    let entruckTime = this.state.entruckTime;
    let entruckTimeObj = new Date(entruckTime);
    let timeAreaSelectorTitle = entruckTime
      ? `${entruckTime}${DT.isToday(entruckTimeObj) ? ' (今天)' : ''}`
      : '';

    let timeArea = this.state.timeArea;
    let entruckTimeStr = entruckTime ? (entruckTime + (timeArea ? ` ${timeArea.name}` : '')) : null;

    return (
      <section className="pkg-pub">
        <h2 className="subtitle"><b>*</b>装车日期</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-calendar s20"></i></label>
            <div className="control">
              <span
                className={cx('input-holder', entruckTime && 'on' || '')}
                onClick={() => { this.refs.datepicker.show(new Date()); }}
              >{entruckTimeStr || '请选择装车日期'}</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>

        <h2 className="subtitle"><b>*</b>地址信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point on s20"></i></label>
            <div
              ref="fromCityField"
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'fromCity')}>
              <span
                className={cx('input-holder', this.state.fromCity && 'on' || '')}
              >{this.state.fromCity || '请选择出发地址'}</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="详细地址(选填)"
                value={props.detailFromCity}
                onChange={props.handleStrChange.bind(this, 'detailFromCity', this.writeDraft.bind(this))}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point on s20"></i></label>
            <div
              ref="toCityField"
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'toCity')}>
              <span
                className={cx('input-holder', this.state.toCity && 'on' || '')}
              >{this.state.toCity || '请选择到达地址'}</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="详细地址(选填)"
                value={props.detailToCity}
                onChange={props.handleStrChange.bind(this, 'detailToCity', this.writeDraft.bind(this))}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>

        <h2 className="subtitle"><b>*</b>货物信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <a
                href="./pkg-info-pub.html"
                className={cx('input-holder', states.pkgInfoDesc && 'on' || '')}
              >{states.pkgInfoDesc || '请填写货物信息'}</a>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>

        <h2 className="subtitle"><b>*</b>用车要求</h2>
        <div className="field-group">
          <div className="field">
            <label>
              <i className="icon icon-truck-type s20"></i>
            </label>
            <div className="control">
              <a
                href="./truck-requirement.html"
                className={cx('input-holder', states.truckUseInfoDesc && 'on' || '')}
              >
                {states.truckUseInfoDesc || '请填写用车要求'}
              </a>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span
                className="input-holder"
                onClick={this.handleClickSelectLoadType.bind(this)}
              >
                <i className="inner-label">装货方式</i>
                <b className="inner-val">{this.state.loadType.name}</b>
              </span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon s20"></i></label>
            <div className="control">
              <span
                className="input-holder"
                onClick={this.handleClickSelectPaymentType.bind(this)}
              >
                <i className="inner-label">运费结算方式</i>
                <b className="inner-val">{this.state.paymentType.name}</b>
              </span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <h2 className="subtitle"><b></b>备注</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              {this.renderMemo()}
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <FixedHolder height="70" />
        <button
          className="btn block teal pub-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >发布</button>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <DatePicker ref="datepicker" onSelect={this.handleSelectDate.bind(this)} />
        <Selector
          ref="dateAreaSelector"
          items={this.state.timeAreas}
          title={timeAreaSelectorTitle}
          select={this.handleSelectTimeArea.bind(this)} />
        <CitySelector
          ref="citySelector"
          prefix={PAGE_TYPE}
          onSelectProvince={this.handleSelectProvince.bind(this)}
          onSelectCity={this.handleSelectCity.bind(this)}
          onSelectArea={this.handleSelectArea.bind(this)}
          onSelectHistory={this.handleSelectHistory.bind(this)}
          onClose={this.handleCloseCitySelector.bind(this)}
          onShow={this.handleShowCitySelector.bind(this)}
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
        <Selector
          ref="loadTypeSelector"
          items={this.state.loadTypes}
          title="装货方式"
          select={this.handleSelectLoadType.bind(this)} />
        <Selector
          ref="paymentTypeSelector"
          items={this.state.paymentTypes}
          title="运费结算方式"
          select={this.handleSelectPaymentType.bind(this)} />
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, document.querySelector('.page'));
