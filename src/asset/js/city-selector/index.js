/**
 * 地址选择器
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../less/global/layout.less';
import './index.less';

import React from 'react';
import cx from 'classnames';
import ReactIScroll from 'react-iscroll';
import IScroll from 'iscroll/build/iscroll';
import injectTapEventPlugin from 'react-tap-event-plugin';

import find from 'lodash/collection/find';
import Mask from '../mask/';
import Loading from '../loading/';
import Poptip from '../poptip/';
import Log from '../log/';
import $ from '../helper/z';
import AH from '../helper/ajax';
import {Cities} from './model';

// 因为 iscroll 禁用了 click 事件，
// 若启用 iscroll click, 会对其他默认滚动列表，滚动时触发 click
// 启用 tap 事件
injectTapEventPlugin();

const HISTORY = '_city_selector_histories';
const ALL = '全部';

export default class CitySelector extends React.Component {
  static defaultProps = {
    options: {
      mouseWheel: true,
      // click: true,
      scrollbars: true
    },
    onSelectHistory: () => {},
    onSelectArea: () => {},
    onSelectCity: () => {},
    onSelectProvince: () => {},
    onCancel: () => {},
    onClose: () => {},
    onShow: () => {},
    done: () => {}
  };

  state = {
    historyCities: [],
    provinces: [],
    cities: [],
    areas: []
  };

  constructor() {
    super();
  }

  show(top: String, step=3, useHistory=true) {
    this.setState({
      top: top,
      on: true,
      step: step,
      useHistory: useHistory
    });

    this.props.onShow();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    // 若获取过省份列表，则直接展示，无须再次请求
    if (this.state.provinces && this.state.provinces.length) {
      return;
    }

    this.fetchProvinces();
  }

  /**
   * 获取省份列表
   */
  fetchProvinces() {
    this.ah.one(Cities, {
      success: (res) => {
        this.setState({
          provinces: res.result
        });
      },
      error: (err) => {
        this.refs.poptip.warn('加载省份失败,请重试');
      }
    });
  }

  /**
   * 获取城市列表
   */
  fetchCities() {
    this.ah.one(Cities, {
      success: res => {
        this.setState({
          cities: res
        });
      },
      error: err => {

        this.refs.poptip.warn('加载城市失败,请重试');
      }
    }, [this.state.regionIndex, this.state.provinceIndex].join());
  }

  /**
   * 获取地区列表
   */
  fetchAreas() {
    this.ah.one(Cities, {
      success: res => {
        this.setState({
          areas: res
        });
      },
      error: err => {
        this.refs.poptip.warn('加载地区失败,请重试');
      }
    }, [this.state.regionIndex, this.state.provinceIndex, this.state.cityIndex].join());
  }

  componentWillReceiveProps() {
    this.setState({
      historyCities: JSON.parse(localStorage.getItem(`${this.props.prefix}${HISTORY}`)) || []
    });
  }

  /**
   * 处理选择历史记录
   */
  select_history(item) {
    this.props.onSelectHistory(item.province, item.city, item.area);

    this.setState({
      province: item.province,
      city: item.city,
      area: item.area
    }, () => {
      this.done();
    });
  }

  /**
   * 处理选择地区
   */
  select_area(area) {
    this.setState({
      area: area
    }, () => {
      this.props.onSelectArea(area, this.state.city, this.state.province);

      this.done();
    });
  }

  /**
   * 处理选择城市
   */
  select_city(city, cityIndex) {
    this.setState({
      city: city,
      cityIndex: cityIndex
    }, () => {
      this.props.onSelectCity(city, this.state.province);

      if (city === ALL || this.state.step === 2) {
        this.done();

        return;
      }

      this.fetchAreas();
    });
  }

  /**
   * 处理选择省份
   */
  select_province(province, regionIndex, provinceIndex) {
    this.setState({
      province: province,
      regionIndex: regionIndex,
      provinceIndex: provinceIndex
    }, () => {
      this.props.onSelectProvince(province);

      if (province === ALL || this.state.step === 1) {
        this.done();
        return;
      }

      this.fetchCities();
    });


  }

  /**
   * 完成地址选择
   */
  done() {
    let province = this.state.province;
    let city = this.state.city;
    let area = this.state.area;

    // 若有选择，则写入历史记录
    if (province && province !== ALL && this.state.useHistory) {
      this.writeHistory2Local({
        province: province,
        city: city === ALL ? null : city,
        area: area === ALL ? null : area
      });
    }

    this.props.done(province, city, area);
    this.close();
  }

  writeHistory2Local(history) {
    let histories = JSON.parse(localStorage.getItem(`${this.props.prefix}${HISTORY}`)) || [];

    let has = find(histories, (item) => {
      return item.province === history.province &&
        item.city == history.city &&
        item.area == history.area;
    });

    if (!has) {
      let copy = histories.slice();

      if (histories.length >= 6) {
        copy.pop();
      }

      copy.unshift({
        province: history.province,
        city: history.city === ALL ? null : history.city,
        area: history.area === ALL ? null : history.area
      });

      localStorage.setItem(`${this.props.prefix}${HISTORY}`, JSON.stringify(copy));
    }
  }

  /**
   * 清除选中数据
   */
  clear() {
    this.setState({
      province: null,
      city: null,
      area: null,
      cityIndex: null,
      regionIndex: null,
      provinceIndex: null
    });
  }

  /**
   * 关闭地址选择器
   */
  close() {
    this.clear();

    this.setState({
      on: false
    });

    this.props.onClose();
  }

  /**
   * 点击空白区域取消选择
   */
  cancel(e) {
    if (e.currentTarget !== e.target) {
      return;
    }

    this.close();

    let province = this.state.province;
    let city = this.state.city;
    let area = this.state.area;

    this.props.onCancel(province, city, area);
  }

  /**
   * 展示历史记录
   */
  renderHistory() {
    let list = this.state.historyCities;

    if (list.length && this.state.useHistory) {
      let historyList = list.map((item, index) => {
        return (
          <li
            key={`history_${index}`}
            onTouchTap={this.select_history.bind(this, item)}
          >{item.area || item.city || item.province}</li>
        );
      });

      return (
        <div className="history">
          <h2>历史记录</h2>
          <ul className="history-cities">
            {historyList}
          </ul>
        </div>
      );
    }
  }

  /**
   * 展示省份或城市或地区列表
   */
  renderItems() {
    if (!this.state.province) {
      return this.renderItem(this.state.provinces, 'province');
    }

    if (!this.state.city) {
      return this.renderItem(this.state.cities, 'city');
    }

    return this.renderItem(this.state.areas, 'area');
  }

  /**
   * 展示城市或省份或地区项
   */
  renderItem(list, field) {
    if (field === 'province') {
      let rowList = list.map((item, index) => {
        let children = item.child.map((province, pIndex) => {
          return (
            <div
              className="item"
              key={`${field}_${pIndex}`}
              onTouchTap={this[`select_${field}`].bind(this, province, index, pIndex)}
            >{province}</div>
          );
        });

        return (
          <dl className="row" key={`region_${index}`}>
            <dt className="hd">{item.name}</dt>
            <dd className="bd">
              {children}
            </dd>
          </dl>
        );
      });

      rowList.unshift((
        <dl className="row" key={`region_all`}>
          <dt className="hd"></dt>
          <dd className="bd">
            <div
              className="item"
              onTouchTap={this[`select_${field}`].bind(this, ALL)}
            >{ALL}</div>
          </dd>
        </dl>
      ));

      return rowList;
    }

    let children = (list.child || []).map((item, index) => {
      return (
        <div
          className="item"
          key={`${field}_${item}`}
          onTouchTap={this[`select_${field}`].bind(this, item, index)}
        >{item}</div>
      );
    });

    return (
      <dl className="row" key={`${field}`}>
        <dt className="hd">{list.name}</dt>
        <dd className="bd">
          {children}
        </dd>
      </dl>
    );
  }

  render() {
    let winH = $.height(window);
    let top = this.state.top;
    let height = winH - top;

    if (height < 292) {
      top = 0;
      height = winH;
    }

    let cxs = cx('city-selector', this.state.on ? 'on' : '');

    return (
      <section
        className={cxs}
        style={{
          height: height + "px",
          top: top + "px"
        }}
        onClick={this.cancel.bind(this)}>
        <div className="inner">
          {this.renderHistory()}
          <div className="cities">
            <ReactIScroll
              iScroll={IScroll}
              options={this.props.options}>
              <div className="scroller">
                {this.renderItems()}
              </div>
            </ReactIScroll>
          </div>
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}
