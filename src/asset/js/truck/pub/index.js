/**
 * 发布车源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';

import $ from '../../helper/z';
import Log from '../../log/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';
import AH from '../../helper/ajax';
import {
  TruckTags,
  PubTruckRoute
} from '../model/';

import {OrderedEnumValue} from '../../model/';

const TRUCK_PUB = 'truck-pub';
const DEFAULT_TRUCK = 'default-truck';
const PAGE_TYPE = 'trucker_page';
const ALL = '全部';
const ERR_MSG = {
  1001: '请选择车辆',
  1002: '您没有登录',
  1003: '您没有登录'
};

export default class TruckPubPage extends React.Component {

  state = assign({
    qs: querystring.parse(location.search.substring(1)),
    memoMaxLength: 80,
    memo: '',
    fromCities: [],
    toCities: [],
    selectedTruckTag: {},
    truck: JSON.parse(localStorage.getItem(DEFAULT_TRUCK))
  }, JSON.parse(localStorage.getItem(TRUCK_PUB)) || {});

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.fetchTruckTagList();
  }

  /**
   * 获取车辆标签列表
   */
  fetchTruckTagList() {
    this.ah.one(OrderedEnumValue, {
      success: (res) => {
        let truckTags = res.truckTagMap.map(item => {
          return {
            name: item.value,
            id: item.key
          };
        });

        let selectedTruckTag = this.state.selectedTruckTag;

        this.setState({
          truckTags: truckTags,
          selectedTruckTag: selectedTruckTag.id != null ? selectedTruckTag : truckTags[0]
        });
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('获取车辆标签失败,请重试');
      }
    }, 'truckTag');
  }

  /**
   * 转换为服务端需要的数据格式
   * @param  {Object} data 需要转换的数据
   * @return {Object} 转换后的数据
   */
  format(data) {
    let fromCities = data.fromCities;
    let fromCitiesLen = fromCities.length;

    if (fromCitiesLen > 0 && !fromCities[fromCitiesLen - 1]) {
      fromCities.splice(fromCitiesLen - 1, 1);
    }

    let toCities = data.toCities;
    let toCitiesLen = toCities.length;

    if (toCitiesLen > 0 && !toCities[toCitiesLen - 1]) {
      toCities.splice(toCitiesLen - 1, 1);
    }

    data.fromCities = fromCities.join().replace('-', ' ');
    data.toCities = toCities.join().replace('-', ' ');

    return data;
  }

  /**
   * 表单字段校验
   * @param  {Object} data 需要校验的数据
   * @return {Mix} 校验通过返回 true, 不通过返回提示信息
   */
  validate(data) {
    if (!data.fromCities || !data.fromCities.length || !data.fromCities[0]) {
      return '出发地址不能为空';
    }

    if (!data.toCities || !data.toCities.length || !data.toCities[0]) {
      return '到达地址不能为空';
    }

    if (!data.truckID) {
      return '请选择车辆';
    }

    return true;
  }

  /**
   * 车源发布提交
   * @param  {ClickEvent} e
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    let data = {
      truckID: this.state.truck && this.state.truck.truckID,
      shuoshuo: this.state.memo,
      fromCities: this.state.fromCities,
      toCities: this.state.toCities,
      truckTag: this.state.selectedTruckTag.id
    };

    let msg = this.validate(data);
    if (msg !== true) {
      this.refs.poptip.warn(msg);
      return;
    }

    _hmt.push(['_trackEvent', '车源', '发布', new Date().toLocaleString()]);
    data = this.format(data);

    this.ah.one(PubTruckRoute, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(ERR_MSG[res.retcode]);

          return;
        }

        _hmt.push(['_setCustomVar', 1, 'pub_truck', '发布成功', 2]);
        this.refs.poptip.success('发布车源成功');

        // 清除草稿
        localStorage.removeItem(TRUCK_PUB);

        this.setState({
          shuoshuo: null,
          fromCities: [],
          toCities: [],
          selectedTruckTag: {}
        });

        setTimeout(() => {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/my-truck.html?' + querystring.stringify(this.state.qs));
        }, 2000);
      },
      error: (err) => {
        _hmt.push(['_setCustomVar', 1, 'pub_truck', '发布失败', 2]);

        Log.error(err);
        this.refs.poptip.warn('发布失败,请重试');
      }
    }, data);
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
      selectedTruckTag: this.state.selectedTruckTag,
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
    let state = this.state;
    let cs = this.refs.citySelector;
    let top = this.getCitySelectorTop(this.refs[`${field}AddrField${index}`]);
    this.setCityField(field, index);

    if (field === state.citySelectorField && index === state.citySelectorIndex) {
      if (state.showCitySelector) {
        cs.close();
        return;
      }

      cs.show();
      return;
    }

    // 点击非当前地址选择器
    cs.clear();
    cs.show(top);
  }

  getCitySelectorTop(target) {
    let offset = $.offset(target);

    return offset.top + offset.height - 1;
  }

  setCityField(field, index) {
    this.setState({
      citySelectorField: field,
      citySelectorIndex: index
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

      let index = addrs.length - 1;
      let top = this.getCitySelectorTop(this.refs[`${field}AddrField${index}`]);
      let cs = this.refs.citySelector;
      this.setCityField(field, index);
      cs.clear();
      cs.show(top);

      this.setState({
        showCitySelector: true
      });
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

      let top = this.getCitySelectorTop(this.refs[`${field}AddrField${index}`]);
      let cs = this.refs.citySelector;
      cs.close();

      this.setState({
        showCitySelector: false
      });
    });
  }

  /**
   * 选择省份
   * @param  {String} province 省份值
   */
  handleSelectProvince(province) {
    let field = this.state.citySelectorField;
    let addrs = this.state[field];

    if (province === ALL) {
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
    if (city === ALL) {
      return;
    }

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
    if (area === ALL) {
      return;
    }

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
   * 处理选择历史地址
   * @param  {Array} args [省份, 城市, 地区]
   */
  handleSelectHistory(...args) {
    let field = this.state.citySelectorField;
    let index = this.state.citySelectorIndex;
    let addrs = this.state[field];

    let selected = args.filter((arg) => {
      return !!arg;
    });

    addrs[this.state.citySelectorIndex] = selected.join('-');

    this.setState({
      [field]: addrs
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

  /**
   * 处理备注改变
   * @param  {ChangeEvent} e
   */
  handleMemoChange(e: Object) {
    let val = $.trim(e.target.value);

    if (val.length > this.state.memoMaxLength) {
      val = val.substring(0, this.state.memoMaxLength);
    }

    this.setState({
      memo: val
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
    this.setState({
      selectedTruckTag: truckTag
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
    let selectedTruckTag = this.state.selectedTruckTag;

    if (truckTags && truckTags.length) {
      return truckTags.map((truckTag, index) => {
        return (
          <label key={`truck-tag-item_${index}`}>
            <input
              type="radio"
              name="truck-tag"
              value={truckTag.id}
              checked={selectedTruckTag.id === truckTag.id}
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
        icon = <i className={cx('icon on s20', labelIcon)}></i>;
      }

      return (
        <div
          className="field"
          key={`addr-selector-item_${field}_${index}`}>
          <label>{icon}</label>
          <div
            ref={`${listName}AddrField${index}`}
            className="control"
            onClick={this.toggleCitySelector.bind(this, listName, index)}>
            <span
              className={cx('input-holder', addr && 'on' || '')}
            >{addr || placeholder}</span>
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
        <h2 className="subtitle">备注</h2>
        <div className="field-group">
          <div className="field memo">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <textarea
                placeholder="备注"
                value={this.state.memo}
                onChange={this.handleMemoChange.bind(this)}
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

ReactDOM.render(<TruckPubPage />, document.querySelector('.page'));
