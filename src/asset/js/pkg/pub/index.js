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

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Log from '../../log/';
import CitySelector from '../../city-selector/';
import Selector from '../../selector/';
import FixedHolder from '../../fixed-holder/';
import {SelectTruckTypeEnhance} from '../../enhance/select-truck-type';
import {FieldChangeEnhance} from '../../enhance/field-change';

const DRAFT = 'pkg-pub';
const MEMO = 'pkg-pub-memo';
const PAGE_TYPE = 'shipper_page';
const ALL = '不限';

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class PkgPubPage extends React.Component {
  static defaultProps = JSON.parse(localStorage.getItem(DRAFT)) || {};

  state = $.extend({
    qs: querystring.parse(location.search.substring(1)),
    memo: localStorage.getItem(MEMO)
  }, JSON.parse(localStorage.getItem(DRAFT)) || {});

  constructor(props) {
    super(props);
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

    this.refs.loading.show('发布中...');

    new Promise((resolve, reject) => {
      let props = this.props;

      $.ajax({
        url: '/mvc/product_addNew_json',
        type: 'POST',
        data: {
          fromCity: this.state.fromCity,
          toCity: this.state.toCity,
          truckType: props.truckType.id,
          truckLength: props.truckLength.id,
          title: props.pkgType,
          loadLimit: props.pkgWeight,
          memo: this.state.memo
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn('发布货源失败');

        return;
      }

      _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布成功', 2]);

      this.refs.poptip.success('发布货源成功');

      // 清空发布货源草稿及备注
      localStorage.removeItem(DRAFT);
      localStorage.removeItem(MEMO);

      this.setState({
        fromCity: null,
        toCity: null,
        memo: null
      });

      this.forceUpdate();

      setTimeout(() => {
        location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/my-pkg.html?' + querystring.stringify(this.state.qs));
      }, 2000);
    }).catch(() => {
      _hmt.push(['_setCustomVar', 1, 'pub_pkg', '发布失败', 2]);

      this.refs.poptip.error('发布货源失败');
    }).done(() => {
      this.refs.loading.close();
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

    if (!props.truckType || $.trim(props.truckType.id) === '') {
      return '车型不能为空';
    }

    if (!props.truckLength || $.trim(props.truckLength.id) === '') {
      return '车长不能为空';
    }

    if (parseFloat(props.weight) > 9999) {
      return '载重不能超过9999吨';
    }

    return true;
  }

  /**
   * 写入草稿
   */
  writeDraft() {
    let props = this.props;

    localStorage.setItem(DRAFT, JSON.stringify({
      truckType: props.truckType,
      truckLength: props.truckLength,
      pkgType: props.pkgType,
      fromCity: this.state.fromCity,
      toCity: this.state.toCity,
      pkgWeight: props.pkgWeight
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
    let offset = $(target).offset();

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

  /**
   * 处理数字型字段值修改
   * @param  {String} field 字段名
   * @param  {ChangeEvent} e
   */
  handleNumChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d\.]+/g, '')
    }, () => {
      this.writeDraft();
    });
  }

  handleStrChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value)
    }, () => {
      this.writeDraft();
    });
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
      <a href="./pkg-pub-memo.html" className="input-holder">备注</a>
    );
  }

  render() {
    let props = this.props;
    let truckType = props.truckType;
    let truckLength = props.truckLength;

    let truckDesc = truckType && truckType.name ? `${truckType.name} ${truckLength && truckLength.name || ''}` : null;

    return (
      <section className="pkg-pub">
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
        </div>
        <h2 className="subtitle">货车要求</h2>
        <div className="field-group">
          <div className="field">
            <label>
              <b>*</b>
              <i className="icon icon-truck-type s20"></i>
            </label>
            <div className="control">
              <span
                className={cx('input-holder', truckDesc && 'on' || '')}
                onClick={props.handleSelectTruckType.bind(this,  this.writeDraft.bind(this))}
              >{truckDesc || '选择车型'}</span>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货物种类"
                value={props.pkgType}
                onChange={props.handleStrChange.bind(this, 'pkgType', this.writeDraft.bind(this))}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-weight s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货重(单位: 吨)"
                value={props.pkgWeight}
                onChange={props.handleFloatChange.bind(this, 'pkgWeight', this.writeDraft.bind(this))}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
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
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, $('#page').get(0));
