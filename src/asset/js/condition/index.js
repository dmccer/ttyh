/**
 * 搜索条件
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 * Usage:
 *
 * const PAGE_TYPE = 'trucker_page';
 *
 * function handleSearchConditionInit(condition) {
 * 		// fetch data with condition
 * }
 *
 * <SearchCondition
 * 	pageType={PAGE_TYPE}
 * 	init={this.handleSearchConditionInit.bind(this)}
 * />
 */
import '../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import querystring from 'querystring';
import Promise from 'promise';
import cx from 'classnames';

import CitySelector from '../city-selector/';
import FixedHolder from '../fixed-holder/';

const SEARCH_FILTER_SUFFIX = '_search_filter';

export default class SearchCondition extends Component {
  static defaultProps = {
    init: () => {}
  };

  state = {
    qs: querystring.parse(location.search.substring(1)),
    url: location.href.split('?')[0].split('#')[0]
  };

  constructor() {
    super();
  }

  componentWillMount() {
    let props = this.props;
    let qs = this.state.qs;

    let r = {
      fromCity: qs.fromCity,
      toCity: qs.toCity,
    };

    // 获取本地筛选条件
    let filters = JSON.parse(localStorage.getItem(`${props.pageType}${SEARCH_FILTER_SUFFIX}`));

    if (filters) {
      let m = (a, b) => {
        return a.id;
      };

      let truckTypeFlag = (filters.selectedTruckTypes || []).map(m).join(',');
      let loadLimitFlag = (filters.selectedLoadLimits || []).map(m).join(',');
      let truckLengthFlag = (filters.selectedTruckLengths || []).map(m).join(',');

      $.extend(r, {
        truckTypeFlag: truckTypeFlag,
        loadLimitFlag: loadLimitFlag,
        truckLengthFlag: truckLengthFlag
      });

      // 如果本地筛选条件和查询参数的筛选条件不一致，则更新查询参数
      // 即筛选条件发生改变，更新查询参数
      if (qs.truckTypeFlag !== truckTypeFlag ||
        qs.loadLimitFlag !== loadLimitFlag ||
        qs.truckLengthFlag !== truckLengthFlag) {
        location.replace(`${this.state.url}?${querystring.stringify(r)}`);

        return;
      }
    }

    // 若本地无筛选条件，但查询参数有，则更新本地筛选条件
    if (!filters && (qs.truckTypeFlag || qs.loadLimitFlag || qs.truckLengthFlag)) {
      let format = (field) => {
        let m = (v) => {
          return { id: v };
        };

        return $.trim(qs[field]) !== '' && qs[field].split(',').map(m) || [];
      }

      localStorage.setItem(`${props.pageType}${SEARCH_FILTER_SUFFIX}`, JSON.stringify({
        selectedTruckTypes: format('truckTypeFlag'),
        selectedLoadLimits: format('loadLimitFlag'),
        selectedTruckLengths: format('truckLengthFlag')
      }));
    }

    this.setState(r);
  }

  componentDidMount() {
    // 页面加载 SearchCondition, 初始化数据
    this.props.init({
      fromCity: this.state.fromCity,
      toCity: this.state.toCity,
      truckTypeFlag: this.state.truckTypeFlag,
      loadLimitFlag: this.state.loadLimitFlag,
      truckLengthFlag: this.state.truckLengthFlag
    });
  }

  /**
   * 切换展示地址选择器
   * @param  {String} field 设置地址字段名
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
      this.setState({
        showCitySelector: !state.showCitySelector
      });

      if (state.showCitySelector) {
        cs.clear();
        cs.close();

        return;
      }

      cs.show();

      return;
    }

    this.setState({
      showCitySelector: true
    });

    cs.clear();
    cs.show(top);
  }

  getCitySelectorTop(target) {
    let offset = $(target).offset();

    return offset.top + offset.height - 1;
  }

  /**
   * 设置地址选择器选择的地址到 state
   * @param {Array} args
   */
  setCitySelectorField(args) {
    let selected = args.filter((arg) => {
      return !!arg;
    });

    let val = selected.join(' ');

    if (val === '不限') {
      val = '';
    }

    this.setState({
      [this.state.citySelectorField]: val
    }, () => {
      let field = this.state.citySelectorField;
      let qs = querystring.stringify($.extend(this.state.qs, {
        [`${field}`]: this.state[field]
      }));

      // 更新 url querystring
      location.replace(`${this.state.url}?${qs}`);
    });
  }

  /**
   * 处理完成地址选择
   * @param  {Array} args
   */
  handleSelectCityDone(...args) {
    this.setCitySelectorField(args);
  }

  render() {
    let props = this.props;
    let fromCity = this.state.showCitySelector && this.state.citySelectorField === 'fromCity' ? 'on' : '';
    let toCity = this.state.showCitySelector && this.state.citySelectorField === 'toCity' ? 'on' : '';

    return (
      <div className="search-condition">
        <ul className="filters row">
          <li
            className={fromCity}
            ref="fromCityField"
            onClick={this.toggleCitySelector.bind(this, 'fromCity')}>
            <a href="javascript:void(0)">
              <i className={cx('icon icon-start-point s18', fromCity)}></i>
              <span>出发地点</span>
            </a>
          </li>
          <li
            className={toCity}
            ref="toCityField"
            onClick={this.toggleCitySelector.bind(this, 'toCity')}>
            <a href="javascript:void(0)">
              <i className={cx('icon icon-end-point s18', toCity)}></i>
              <span>到达地点</span>
            </a>
          </li>
          <li>
            <a href={`./search-filter.html?type=${props.pageType}`}>
              <i className="icon icon-filter off s18"></i>
              <span>筛选</span>
            </a>
          </li>
        </ul>
        <FixedHolder height="41" />
        <CitySelector
          ref="citySelector"
          prefix={props.pageType}
          done={this.handleSelectCityDone.bind(this)}
        />
      </div>
    );
  }
}
