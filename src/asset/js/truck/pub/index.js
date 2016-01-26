import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';

const TRUCK_PUB = 'truck-pub';
const DEFAULT_TRUCK = 'default-truck';
const CITY_SELECTOR_PREFIX = 'trucker_';

export default class TruckPubPage extends React.Component {

  state = $.extend({
    qs: querystring.parse(location.search.substring(1)),
    memoMaxLength: 80,
    memo: '',
    fromCities: [],
    toCities: [],
    truck: JSON.parse(localStorage.getItem(DEFAULT_TRUCK)),
  }, JSON.parse(localStorage.getItem(TRUCK_PUB)) || {});

  constructor() {
    super();
  }

  /**
   * 获取车辆标签列表
   */
  fetchTruckTagList() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckTag',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      delete res.truckTagList['0'];

      let truckTagListKeys = Object.keys(res.truckTagList);
      let truckTagList = truckTagListKeys.map((key) => {
        return {
          name: res.truckTagList[key],
          id: key
        };
      });

      return truckTagList;
    });
  }

  componentWillMount() {
    this
      .fetchTruckTagList()
      .then((truckTagList) => {
        this.setState({
          truckTags: truckTagList
        });
      })
      .catch((...args) => {
        console.log(args)
        this.refs.poptip.warn('获取车辆标签失败,请重试');
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO:
    // 提交服务器
  }

  /**
   * 清除地址列表中为空的元素，最后一个元素允许为空
   * @param  {String} field 地址列表字段名
   * @return {Array} 新地址列表
   */
  removeNullAddr(field) {
    let addrs = this.state[field];
    let len = addrs.length;

    addrs = addrs.filter((addr, index) => {
      if (index === len - 1) {
        return true;
      }

      return addr != null;
    });

    return addrs;
  }

  /**
   * 写入车源数据到本地，暂存为草稿
   */
  writeDraft() {
    let fromCities = this.removeNullAddr('fromCities');
    let toCities = this.removeNullAddr('toCities');

    let d = {
      fromCities: fromCities,
      toCities: toCities,
      selectedTruckTags: this.state.selectedTruckTags,
      memo: this.state.memo
    };

    this.setState(d);
    localStorage.setItem(TRUCK_PUB, JSON.stringify(d));
  }

  /**
   * 打开/关闭地址选择器
   * @param  {String} field 地址列表字段名
   * @param  {Number} index 需要打开/关闭的元素索引
   * @param  {ClickEvent} e
   */
  toggleCitySelector(field, index, e) {
    let offset = $(e.target).offset();
    let top = offset.top + offset.height - 1;

    this.setState({
      citySelectorTop: top,
      citySelectorField: field,
      citySelectorIndex: index,
      showCitySelector: !this.state.showCitySelector
    });
  }

  /**
   * 给地址列表中添加一个元素
   * @param {String} field 地址列表字段名
   * @param {ClickEvent} e
   */
  addAddrSelector(field, e) {
    e.preventDefault();
    e.stopPropagation();

    let addrs = this.state[field];
    addrs.push(null);

    this.setState({
      [field]: addrs
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 删除地址列表中的一个元素
   * @param  {String} field 地址列表字段名
   * @param  {String} addr 待删除的元素
   * @param  {ClickEvent} e
   */
  delAddrSelector(field, addr, e) {
    e.preventDefault();
    e.stopPropagation();

    let addrs = this.state[field];
    let index = addrs.indexOf(addr);

    addrs.splice(index, 1);

    this.setState({
      [field]: addrs
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 选择省份
   * @param  {String} province 省份值
   */
  handleSelectProvince(province) {
    let field = this.state.citySelectorField;
    let addrs = this.state[field];

    if (province === '不限') {
      province = null;
    }

    addrs[this.state.citySelectorIndex] = province;

    this.setState({
      [field]: addrs
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 选择城市
   * @param  {String} city 城市值
   */
  handleSelectCity(city) {
    let field = this.state.citySelectorField;
    let index = this.state.citySelectorIndex;
    let addrs = this.state[field];
    let pre = addrs[index];
    addrs[this.state.citySelectorIndex] = `${pre}-${city}`;

    this.setState({
      [field]: addrs
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 选择地区
   * @param  {String} area 区
   */
  handleSelectArea(area) {
    let field = this.state.citySelectorField;
    let index = this.state.citySelectorIndex;
    let addrs = this.state[field];
    let pre = addrs[index];
    addrs[this.state.citySelectorIndex] = `${pre}-${area}`;

    this.setState({
      [field]: addrs
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 取消地址选择
   */
  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  /**
   * 处理字符串类型字段改变
   * @param  {String} field 字段名
   * @param  {ChangeEvent} e
   */
  handleStrChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value)
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 处理选择车辆标签
   * @param  {Object} truckTag
   * @param  {ChangeEvent} e
   */
  handleTruckTagChange(truckTag, e) {
    let selectedTruckTags = this.state.selectedTruckTags || [];
    let index = selectedTruckTags.indexOf(truckTag.id);

    if (e.target.checked) {
      if (index !== -1) {
        return;
      }

      selectedTruckTags.push(truckTag.id);
    } else {
      if (index === -1) {
        return;
      }

      selectedTruckTags.splice(index, 1);
    }

    this.setState({
      selectedTruckTags: selectedTruckTags
    }, () => {
      this.writeDraft();
    });
  }

  /**
   * 展示车辆标记选择列表
   * @return {[type]} [description]
   */
  renderTruckTagList() {
    let truckTags = this.state.truckTags;
    let selectedTruckTags = this.state.selectedTruckTags;
    if (truckTags && truckTags.length) {
      return truckTags.map((truckTag, index) => {
        return (
          <label key={`truck-tag-item_${index}`}>
            <input
              type="checkbox"
              value={truckTag.id}
              checked={selectedTruckTags.indexOf(truckTag.id) !== -1}
              onChange={this.handleTruckTagChange.bind(this, truckTag)}
            />
            {truckTag.name}
          </label>
        )
      });
    }
  }

  /**
   * 展示选中的车辆
   */
  renderSelectedTruck() {
    let truck = this.state.truck;

    if (truck) {
      let truckLength = truck.truckLength != null && parseFloat(truck.truckLength) !== 0 ? `${truck.truckLength}米`: '';
      let loadLimit = truck.loadLimit != null && parseFloat(truck.loadLimit) !== 0 ? `${truck.loadLimit}吨` : '';

      return (
        <a href="./roadtrain.html">
          <h3>{truck.dirverName}</h3>
          <p>{truck.licensePlate} {truck.truckTypeStr} {truckLength} {loadLimit}</p>
          <i className="icon icon-arrow"></i>
        </a>
      );
    }

    return (
      <a href="./roadtrain.html">
        <h3>请选择车辆</h3>
        <i className="icon icon-arrow"></i>
      </a>
    );
  }

  /**
   * 展示地址选择列表
   */
  renderAdrrSelectList(field, listName, labelIcon, placeholder) {
    let addrs = this.state[listName];

    if (!addrs || !addrs.length) {
      addrs = [null]
    }

    let len = addrs.length;

    return addrs.map((addr, index) => {
      let action, icon;

      if (!addr) {
        action = <i className="icon icon-arrow"></i>;
      } else {
        if (len === 1 || index === len - 1) {
          action = <i className="icon s20 icon-add-addr" onClick={this.addAddrSelector.bind(this, listName)}></i>;
        } else {
          action = <i className="icon s20 icon-del-addr" onClick={this.delAddrSelector.bind(this, listName, addr)}></i>
        }
      }

      if (index === 0) {
        icon = <i className={cx('icon s20', labelIcon)}></i>;
      }

      return (
        <div className="field" key={`addr-selector-item_${field}_${index}`}>
          <label>{icon}</label>
          <div
            className="control"
            onClick={this.toggleCitySelector.bind(this, listName, index)}>
            <input
              type="text"
              disabled="disabled"
              placeholder={placeholder}
              value={addr} />
            {action}
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <section className="truck-pub">
        <div className="row biz-types">
          {this.renderTruckTagList()}
        </div>
        <h2 className="subtitle"><b>*</b>路线</h2>
        <div className="field-group">
          {this.renderAdrrSelectList('fromCity', 'fromCities', 'icon-start-point', '请选择出发地址')}
          {this.renderAdrrSelectList('toCity', 'toCities', 'icon-end-point', '请选择到达地址')}
        </div>
        <h2 className="subtitle"><b>*</b>选择车辆</h2>
        <ul className="truck-list">
          <li>{this.renderSelectedTruck()}</li>
        </ul>
        <h2 className="subtitle"><b>*</b>备注</h2>
        <div className="field-group">
          <div className="field memo">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <textarea
                placeholder="备注"
                value={this.state.memo}
                onChange={this.handleStrChange.bind(this, 'memo')}
              ></textarea>
              <span className="char-count">{this.state.memo.length}/{this.state.memoMaxLength}</span>
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
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
      </section>
    );
  }
}

ReactDOM.render(<TruckPubPage />, $('#page').get(0));
