import './index.less';

import React from 'react';
import cx from 'classnames';
import ReactIScroll from 'react-iscroll';
import IScroll from 'iscroll/build/iscroll-lite';
import Promise from 'promise';

import Mask from '../mask/';
import Loading from '../loading/';
import Poptip from '../poptip/';

const HISTORY = 'city_selector_histories';

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
    if (this.state.provinces && this.state.provinces.length) {
      return;
    }

    this.fetchProvinces();
  }

  getIndex(field, listName) {
    return this.state[listName].indexOf(this.state[field]);
  }

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
      this.refs.poptip.warn('加载省份失败,请重试');

      console.error(`${new Date().toLocaleString()} - 错误日志 start`)
      console.error(err)
      console.error(`-- 错误日志 end --`)
    }).done(() => {
      this.refs.loading.close();
    });
  }

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
      this.refs.poptip.warn('加载城市失败,请重试');

      console.error(`${new Date().toLocaleString()} - 错误日志 start`)
      console.error(err)
      console.error(`-- 错误日志 end --`)
    }).done(() => {
      this.refs.loading.close();
    });
  }

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
      this.refs.poptip.warn('加载地区失败,请重试');

      console.error(`${new Date().toLocaleString()} - 错误日志 start`)
      console.error(err)
      console.error(`-- 错误日志 end --`)
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
      this.close();
    });
  }

  /**
   * 处理选择地区
   */
  select_area(area) {
    this.props.onSelectArea(area, this.state.city, this.state.province);

    this.setState({
      area: area
    }, () => {
      this.close();
    });

  }

  /**
   * 处理选择城市
   */
  select_city(city) {
    this.setState({
      city: city
    }, () => {
      this.fetchAreas();
    });

    this.props.onSelectCity(city, this.state.province);
  }

  /**
   * 处理选择省份
   */
  select_province(province) {
    this.setState({
      province: province
    }, () => {
      this.fetchCities();
    });

    this.props.onSelectProvince(province);
  }

  /**
   * 结束选择，关闭选择器
   */
  close() {
    // 若有选择，则写入历史记录
    if (this.state.province) {
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

      this.clear();
    }

    this.props.done(this.state.province, this.state.city, this.state.area);
    this.props.onCancel();
  }

  clear() {
    this.setState({
      province: null,
      city: null,
      area: null
    });
  }

  /**
   * 点击空白区域取消选择
   */
  cancel(e) {
    if (e.currentTarget !== e.target) {
      return;
    }

    this.clear();
    this.props.onCancel();
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
