/**
 * 发布货源页面
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

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';
import Selector from '../../selector/';

const CITY_SELECTOR_PREFIX = 'shipper_';
const DRAFT = 'pkg-pub';
const MEMO = 'pkg-pub-memo';

export default class PkgPubPage extends React.Component {
  state = $.extend({
    qs: querystring.parse(location.search.substring(1)),
    truckType: {},
    truckLength: {}
  }, JSON.parse(localStorage.getItem(DRAFT)) || {}, {
    memo: localStorage.getItem(MEMO)
  });

  constructor() {
    super();
  }

  /**
   * 获取车型列表
   * @return {Promise}
   */
  fetchTruckTypes() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckType',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckTypes = res.truckTypeMap;
      truckTypes = Object.keys(truckTypes).map((key) => {
        return {
          name: truckTypes[key],
          id: key
        };
      });

      return truckTypes;
    });
  }

  /**
   * 获取车长列表
   * @return {Promise}
   */
  fetchTruckLengths() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckLength',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckLengths = res.truckLengthList;
      truckLengths = truckLengths.map((len) => {
        return {
          name: len,
          id: len
        };
      });

      return truckLengths;
    });
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

    this.refs.loading.show('发布中...');
    new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/pub_pkg',
        type: 'POST',
        data: {
          startPoint: this.state.startPoint,
          endPoint: this.state.endPoint,
          truckType: this.state.truckType,
          pkgType: this.state.pkgType,
          pkgWeight: this.state.pkgWeight,
          memo: this.state.memo
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.refs.poptip.success('发布货源成功');

      // 清空发布货源草稿及备注
      localStorage.removeItem('pkg-pub');
      localStorage.removeItem('memo');

      this.setState({
        startPoint: null,
        endPoint: null,
        truckType: {},
        pkgType: null,
        pkgWeight: null,
        memo: null
      });

      // TODO: 跳转到我的货源列表页面
    }).catch(() => {
      this.refs.poptip.error('发布货源失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 校验必填字段
   */
  validate() {
    if ($.trim(this.state.startPoint) === '') {
      return '出发地址不能为空';
    }

    if ($.trim(this.state.endPoint) === '') {
      return '到达地址不能为空';
    }

    if ($.trim(this.state.truckType) === '') {
      return '车型不能为空';
    }

    return true;
  }

  /**
   * 写入草稿
   */
  writeDraft() {
    localStorage.setItem(DRAFT, JSON.stringify({
      truckType: this.state.truckType,
      truckLength: this.state.truckLength,
      pkgType: this.state.pkgType,
      startPoint: this.state.startPoint,
      endPoint: this.state.endPoint,
      pkgWeight: this.state.pkgWeight
    }));
  }

  /**
   * 打开/关闭地址选择器
   * @param  {String} field 字段名, fromCity(出发地)或toCity(到达地)
   * @param  {ClickEvent} e
   */
  toggleCitySelector(field, e) {
    e.preventDefault();
    e.stopPropagation();

    let offset = $(e.target).offset();
    let top = offset.top + offset.height;

    this.setState({
      citySelectorTop: top,
      citySelectorField: field,
      showCitySelector: true
    });
  }

  /**
   * 处理选择省份
   * @param  {String} province 省份
   */
  handleSelectProvince(province) {
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

  /**
   * 取消选择地址
   */
  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  /**
   * 处理选择车型和车长
   */
  handleSelectTruckType() {
    // 若已经请求过车型和车长列表，则直接展示
    if (this.state.truckTypes && this.state.truckLengths) {
      this.showSelector('truckType');

      return;
    }

    this.refs.loading.show('加载中...');

    Promise
      .all([this.fetchTruckTypes(), this.fetchTruckLengths()])
      .then((res) => {
        this.setState({
          truckTypes: res[0],
          truckLengths: res[1]
        }, () => {
          this.showSelector('truckType');
        });
      })
      .catch((...args) => {
        this.refs.poptip.warn('获取车型或车长列表失败,请重新打开页面');

        console.error(`${new Date().toLocaleString()} - 错误日志 start`)
        console.error(args[0])
        console.error(`-- 错误日志 end --`)
      })
      .done(() => {
        this.refs.loading.close();
      });
  }

  /**
   * 展示车型或车长选择面板
   * @param  {String} field 字段名，truckType 或 truckLength
   */
  showSelector(field) {
    this.setState({
      selectorItems: this.state[`${field}s`],
      selectorField: field
    }, () => {
      this.refs.selector.show();
    });
  }

  /**
   * 选中车型或车长后存入本地
   * 选中车型后再展示选则车长
   */
  handleSelectItem(item) {
    let field = this.state.selectorField;

    this.setState({
      [this.state.selectorField]: item
    }, () => {
      this.writeDraft();
    });

    if (field === 'truckType') {
      this.showSelector('truckLength');
    }
  }

  handleNumChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d\.]+/g, '')
    }, () => {
      this.writeDraft();
    });
  }

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
    let truckType = this.state.truckType;
    let truckLength = this.state.truckLength;

    let truckDesc = truckType.name ? `${truckType.name} ${truckLength.name || ''}` : null;

    return (
      <section className="pkg-pub">
        <h2 className="subtitle"><b>*</b>地址信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point s20"></i></label>
            <div
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'startPoint')}>
              <input
                type="text"
                disabled="disabled"
                placeholder="请选择出发地址"
                value={this.state.startPoint} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point s20"></i></label>
            <div
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'endPoint')}>
              <input
                type="text"
                disabled="disabled"
                placeholder="请选择到达地址"
                value={this.state.endPoint} />
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
              <input
                type="text"
                disabled="disabled"
                placeholder="选择车型"
                onClick={this.handleSelectTruckType.bind(this)}
                value={truckDesc} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货物种类"
                value={this.state.pkgType} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-weight s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货重"
                value={this.state.pkgWeight}
                onChange={this.handleNumChange.bind(this, 'pkgWeight')}
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
        <button
          className="btn block teal pub-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >发布</button>
        <div className="fixed-holder"></div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <CitySelector
          on={this.state.showCitySelector}
          top={this.state.citySelectorTop}
          prefix={CITY_SELECTOR_PREFIX}
          onSelectProvince={this.handleSelectProvince.bind(this)}
          onSelectCity={this.handleSelectCity.bind(this)}
          onSelectArea={this.handleSelectArea.bind(this)}
          onSelectHistory={this.handleSelectHistory.bind(this)}
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
        <Selector
          ref="selector"
          items={this.state.selectorItems}
          select={this.handleSelectItem.bind(this)} />
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, $('#page').get(0));
