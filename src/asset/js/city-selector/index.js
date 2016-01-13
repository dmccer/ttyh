import './index.less';

import React from 'react';
import cx from 'classnames';
import Mask from '../mask/';

export default class CitySelector extends React.Component {
  constructor() {
    super();

    this.state = {
      historyCities: ['上海', '北京', '天津', '四川', '湛江'],
      provinces: ['上海', '北京', '天津', '四川', '湛江'],
      cities: ['天津', '四川', '湛江'],
      areas: ['北京', '天津', '四川']
    };
  }

  select_area(area) {
    this.props.onSelectArea(area, this.state.city, this.state.province);

    this.close();
  }

  select_city(city) {
    this.setState({
      city: city
    });

    this.props.onSelectCity(city, this.state.province);
  }

  select_province(province) {
    this.setState({
      province: province
    });

    this.props.onSelectProvince(province);
  }

  close() {
    this.props.onCancel();

    this.setState({
      province: null,
      city: null,
      area: null
    });
  }

  cancel(e) {
    if (e.currentTarget !== e.target) {
      return;
    }

    this.close();
  }

  renderItem(list, field) {
    return list.map((item) => {
      return (
        <li key={`${field}_${item}`} onClick={this[`select_${field}`].bind(this, item)}>{item}</li>
      );
    });
  }

  _render() {
    if (!this.state.province) {
      return this.renderItem(this.state.provinces, 'province');
    }

    if (!this.state.city) {
      return this.renderItem(this.state.cities, 'city');
    }

    return this.renderItem(this.state.areas, 'area');
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
        onClick={this.cancel.bind(this)}
      >
        <div className="inner">
          <div className="history">
            <h2>历史记录</h2>
            <ul className="history-cities">
              {this.renderItem(this.state.historyCities, 'area')}
            </ul>
          </div>
          <div className="cities">
            <ul>
              {this._render()}
            </ul>
          </div>
        </div>
      </section>
    );
  }
}
