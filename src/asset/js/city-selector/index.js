import './index.less';

import React from 'react';
import cx from 'classnames';
import ReactIScroll from 'react-iscroll';
import IScroll from 'iscroll/build/iscroll-lite';

import Mask from '../mask/';

const HISTORY = 'city_selector_histories';

export default class CitySelector extends React.Component {
  static defaultProps = {
    options: {
      mouseWheel: true,
      click: true,
      scrollbars: true
    }
  };

  state = {
    historyCities: [],
    provinces: ["北京",
      "天津",
      "河北",
      "山西",
      "内蒙古",
      "辽宁",
      "吉林",
      "黑龙江",
      "上海",
      "江苏",
      "浙江",
      "安徽",
      "福建",
      "江西",
      "山东",
      "河南",
      "湖北",
      "湖南",
      "广东",
      "广西",
      "海南",
      "重庆",
      "四川",
      "贵州",
      "云南",
      "西藏",
      "陕西",
      "甘肃",
      "青海",
      "宁夏",
      "新疆",
      "台湾",
      "香港",
      "澳门"
    ],
    cities: ['济宁', '济南', '青岛'],
    areas: ['任城', '淄博', '兖州']
  };

  constructor() {
    super();
  }

  componentWillMount() {
    // TODO: 获取省份
  }

  componentWillReceiveProps() {
    this.setState({
      historyCities: JSON.parse(localStorage.getItem(HISTORY)) || []
    });
  }

  /**
   * 处理选择历史记录
   */
  select_history(item) {
    this.props.onSelectHistory(item.area, item.city, item.province);

    this.close();
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
    });

    this.props.onSelectCity(city, this.state.province);
  }

  /**
   * 处理选择省份
   */
  select_province(province) {
    this.setState({
      province: province
    });

    this.props.onSelectProvince(province);
  }

  /**
   * 关闭选择器
   */
  close() {
    this.props.onCancel();

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

        localStorage.setItem(HISTORY, JSON.stringify(copy));
      }

      this.setState({
        province: null,
        city: null,
        area: null
      });
    }
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
    return list.map((item) => {
      return (
        <li key={`${field}_${item}`} onClick={this[`select_${field}`].bind(this, item)}>{item}</li>
      );
    });
  }

  render() {
    let height = $(window).height() - this.props.top + 1;
    let top = this.props.top - 1;
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
      </section>
    );
  }
}
