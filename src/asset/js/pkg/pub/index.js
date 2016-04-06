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
import Promise from 'promise';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import $ from '../../helper/z';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Log from '../../log/';
import Selector from '../../selector/';
import CitySelector from '../../city-selector/';
import FixedHolder from '../../fixed-holder/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import DT from '../../helper/date';
import AH from '../../helper/ajax';
import {
  PubPkg
} from '../model/';
import DatePicker from '../../datepicker/';
import {
  PKG_DRAFT, PKG_INFO_DATA,
  PKG_MEMO, TIME_AREAS,
  PAGE_TYPE, PKG_TRUCK_USE_DATA,
  JUST_SELECT_TRUCK_TYPE
} from '../../const/pkg-pub';

const ALL = '不限';
const LOAD_TYPES = [
  {
    name: '不限',
    id: 0
  }, {
    name: '人工',
    id: 1
  }, {
    name: '铲车、叉车',
    id: 2
  }, {
    name: '吊车',
    id: 3
  }
];
const PAYMENT_TYPES = [
  {
    name: '货到付款',
    id: 1
  }, {
    name: '预付部分',
    id: 2
  }, {
    name: '回单结算',
    id: 3
  }
]
const TMP_DATA = JSON.parse(localStorage.getItem(PKG_DRAFT));

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
    memo: localStorage.getItem(PKG_MEMO),
    timeAreas: [],
    loadTypes: LOAD_TYPES,
    paymentTypes: PAYMENT_TYPES,
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
        'loadType', 'paymentType', 'entruckTimeArea'
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
        pkgInfoDesc: `${TMP_PIDATA.pkgName} ${TMP_PIDATA.pkgWeight}吨 ${volumeStr} ${TMP_PIDATA.packManner.name}*${TMP_PIDATA.pkgCount}`
      });
    }

    let TMP_TUDATA = JSON.parse(localStorage.getItem(PKG_TRUCK_USE_DATA));
    if (TMP_TUDATA) {
      let size = TMP_TUDATA.truckUseType.id === JUST_SELECT_TRUCK_TYPE ? `${TMP_TUDATA.stallSize}米` : TMP_TUDATA.truckLength.name;
      this.setState({
        truckUseInfo: TMP_TUDATA,
        truckUseInfoDesc: `${TMP_TUDATA.truckUseType.name} ${TMP_TUDATA.truckType.name} ${size}`
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
  }

  /**
   * 处理提交发布
   * @param  {SubmitEvent} e
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    let r = this.validate();
    if (r !== true) {
      this.refs.poptip.warn(r);

      return;
    }

    _hmt.push(['_trackEvent', '货源', '发布', new Date().toLocaleString()]);

    let props = this.props;

    this.ah.one(PubPkg, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(`发布货源失败,${res.msg}`);

          return;
        }

        _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布成功', 2]);

        this.refs.poptip.success('发布货源成功');

        // 清空发布货源草稿及备注
        localStorage.removeItem(PKG_DRAFT);
        localStorage.removeItem(PKG_MEMO);

        this.setState({
          fromCity: null,
          toCity: null,
          memo: null
        });

        this.forceUpdate();

        setTimeout(() => {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/my-pkg.html?' + querystring.stringify(this.state.qs));
        }, 1500);
      },
      error: () => {
        _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布失败', 2]);

        this.refs.poptip.error('发布货源失败');
      }
    }, {
      fromCity: this.state.fromCity,
      toCity: this.state.toCity,
      truckType: props.truckType.id,
      truckLength: props.truckLength.id,
      title: props.pkgType,
      loadLimit: props.pkgWeight,
      memo: this.state.memo
    });
  }

  /**
   * 校验必填字段
   */
  validate() {
    let props = this.props;

    if ($.trim(this.state.fromCity) === '') {
      return '出发地址不能为空';
    }

    if ($.trim(this.state.toCity) === '') {
      return '到达地址不能为空';
    }

    // if (!props.truckType || $.trim(props.truckType.id) === '') {
    //   return '车型不能为空';
    // }

    // if (!props.truckLength || $.trim(props.truckLength.id) === '') {
    //   return '车长不能为空';
    // }

    // if (parseFloat(props.weight) > 9999) {
    //   return '载重不能超过9999吨';
    // }

    return true;
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
    // TODO
    // set date
    console.log(d);

    let r;

    if (DT.isToday(d)) {
      let h = new Date().getHours();
      r = TIME_AREAS.map((timeArea, index) => {
        if (index === 0) {
          return {
            name: timeArea.name,
            id: timeArea.id,
            disabled: true
          };
        }

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
      entruckTime: DT.toLocaleDateString(d),
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
    let truckType = props.truckType;
    let truckLength = props.truckLength;

    let truckDesc = truckType && truckType.name
      ? `${truckType.name} ${truckLength && truckLength.name || ''}`
      : null;

    let entruckTime = this.state.entruckTime;
    let entruckTimeObj = new Date(entruckTime);
    let timeAreaSelectorTitle = entruckTime
      ? `${DT.toLocaleDateString(entruckTimeObj)}${DT.isToday(entruckTimeObj) ? ' (今天)' : ''}`
      : '';

    let timeArea = this.state.timeArea;
    let entruckTimeStr = entruckTime ? (DT.format(entruckTimeObj) + (timeArea ? ` ${timeArea.name}` : '')) : null;

    return (
      <section className="pkg-pub">
        <h2 className="subtitle"><b>*</b>装车日期</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
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
        <h2 className="subtitle"><b>*</b>备注</h2>
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
          ref="dateAreaSelector"
          items={this.state.timeAreas}
          title={timeAreaSelectorTitle}
          select={this.handleSelectTimeArea.bind(this)} />
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
