/**
 * 地址选择器
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import './index.less';

import React from 'react';
import cx from 'classnames';
import ReactIScroll from 'react-iscroll';
import IScroll from 'iscroll/build/iscroll-lite';
import Promise from 'promise';

import Mask from '../mask/';
import Loading from '../loading/';
import Poptip from '../poptip/';
import Log from '../log/';

const HISTORY = '_city_selector_histories';
const ALL = '不限';

export default class CitySelector extends React.Component {
  static defaultProps = {
    options: {
      mouseWheel: true,
      click: true,
      scrollbars: true
    },
    onSelectHistory: () => {},
    onSelectArea: () => {},
    onSelectCity: () => {},
    onSelectProvince: () => {},
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

  componentDidMount() {
    // 若获取过省份列表，则直接展示，无须再次请求
    if (this.state.provinces && this.state.provinces.length) {
      return;
    }

    this.fetchProvinces();
  }

  /**
   * 获取选中的数据在列表中的索引位置
   * @param  {String} field    字段
   * @param  {String} listName 列表字段
   */
  getIndex(field, listName) {
    return this.state[listName].indexOf(this.state[field]);
  }

  /**
   * 获取省份列表
   */
  fetchProvinces() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getCitys',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        provinces: res.resultList
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('加载省份失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 获取城市列表
   */
  fetchCities() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      let provinces = this.state.provinces;
      let index = provinces.indexOf(this.state.province);

      $.ajax({
        url: '/mvc/v2/getCitys',
        type: 'GET',
        data: {
          cityIndex: this.getIndex('province', 'provinces')
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        cities: res.resultList
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('加载城市失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 获取地区列表
   */
  fetchAreas() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getCitys',
        type: 'GET',
        data: {
          cityIndex: this.getIndex('province', 'provinces'),
          districtIndex: this.getIndex('city', 'cities')
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        areas: res.resultList
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('加载地区失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
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
    if (area === ALL) {
      this.done();

      return;
    }


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
  select_city(city) {
    if (city === ALL) {
      this.done();

      return;
    }

    this.setState({
      city: city
    }, () => {
      this.props.onSelectCity(city, this.state.province);

      this.fetchAreas();
    });
  }

  /**
   * 处理选择省份
   */
  select_province(province) {
    this.setState({
      province: province
    }, () => {
      this.props.onSelectProvince(province);

      if (province === ALL) {
        this.close();

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
    // 若有选择，则写入历史记录
    if (this.state.province && this.state.province !== '不限') {
      let histories = this.state.historyCities;

      let has = histories.find((item) => {
        return item.province === this.state.province &&
          item.city === this.state.city &&
          item.area === this.state.area;
      });

      if (!has) {
        let copy = histories.slice();

        if (histories.length >= 6) {
          copy.pop();
        }

        copy.unshift({
          province: this.state.province,
          city: this.state.city,
          area: this.state.area
        });

        localStorage.setItem(`${this.props.prefix}${HISTORY}`, JSON.stringify(copy));
      }
    }

    this.props.done(this.state.province, this.state.city, this.state.area);
    this.close();
  }

  /**
   * 清除选中数据
   */
  clear() {
    this.setState({
      province: null,
      city: null,
      area: null
    });
  }

  /**
   * 关闭地址选择器
   */
  close() {
    this.clear();
    this.props.onCancel();
  }

  /**
   * 点击空白区域取消选择
   */
  cancel(e) {
    if (e.currentTarget !== e.target) {
      return;
    }

    this.close();
  }

  /**
   * 展示历史记录
   */
  renderHistory() {
    let list = this.state.historyCities;

    if (list.length) {
      let historyList = list.map((item, index) => {
        return (
          <li
            key={`history_${index}`}
            onClick={this.select_history.bind(this, item)}
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
    return list.map((item, index) => {
      return (
        <li key={`${field}_${item}`} onClick={this[`select_${field}`].bind(this, item)}>{item}</li>
      );
    });
  }

  render() {
    let height = $(window).height() - this.props.top;
    let top = this.props.top;
    let cxs = cx('city-selector', this.props.on ? 'on' : '');

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
              <ul>
                {this.renderItems()}
              </ul>
            </ReactIScroll>
          </div>
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}
