import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import '../../../../less/component/icon.less';
import '../../../../less/component/cell-form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import querystring from 'querystring';
import assign from 'lodash/object/assign';
import injectTapEventPlugin from 'react-tap-event-plugin';

import $ from '../../../helper/z';
import CitySelector from '../../../city-selector/';

import {PAGE_TYPE, SELECTED_COMMON_ROUTE} from '../../../const/truck';
const ALL = '全部';
injectTapEventPlugin();

export default class SelectCommonRoutePage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentDidMount() {
    let TMP_DATA = JSON.parse(localStorage.getItem(SELECTED_COMMON_ROUTE));

    if (TMP_DATA) {
      this.setState({
        fromCity: TMP_DATA.fromCity,
        toCity: TMP_DATA.toCity
      });
    }
  }

  handleSubmit() {
    let states = this.state;

    if (states.fromCity && states.toCity) {
      localStorage.setItem(SELECTED_COMMON_ROUTE, JSON.stringify({
        fromCity: states.fromCity,
        toCity: states.toCity
      }));
    }

    let qs = querystring.stringify(assign({}, this.state.qs, {
      refer: 'back'
    }));

    location.replace(location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/truck-add.html?' + qs));
  }

  toggleCitySelector(field, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let state = this.state;
    let cs = this.refs.citySelector;
    let top = this.getCitySelectorTop(this.refs[field]);
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

  handleSelectProvince(province) {
    if (province === ALL) {
      // 清空之前选的值
      province = null;
    }

    this.setState({
      [this.state.citySelectorField]: province
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

  render() {
    return (
      <section className="select-common-route-page">
        <div className="cells cells-access cells-form">
          <div
            className="cell"
            ref="fromCity"
            onClick={this.toggleCitySelector.bind(this, 'fromCity')}>
            <div className="cell_hd">
              <label className="label"><i className="icon icon-start-point on s20"></i></label>
            </div>
            <div className="cell-bd cell-primary">
              <p className={cx(this.state.fromCity ? 'val' : 'holder')}>{this.state.fromCity || '请选择出发地'}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div
            className="cell"
            ref="toCity"
            onClick={this.toggleCitySelector.bind(this, 'toCity')}>
            <div className="cell_hd">
              <label className="label"><i className="icon icon-end-point on s20"></i></label>
            </div>
            <div className="cell-bd cell-primary">
              <p className={cx(this.state.toCity ? 'val' : 'holder')}>{this.state.toCity || '请选择到达地'}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
        </div>
        <div className="bottom-btn">
          <button
            className="btn block teal"
            type="submit"
            onClick={this.handleSubmit.bind(this)}
          >
            确定
          </button>
        </div>
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

ReactDOM.render(<SelectCommonRoutePage />, document.querySelector('.page'));
