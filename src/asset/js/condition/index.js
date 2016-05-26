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
import cx from 'classnames';
import assign from 'lodash/object/assign';

import CitySelector from '../city-selector/';
import DatePicker from '../datepicker/';
import Selector from '../selector/';
import DT from '../helper/date';
import FixedHolder from '../fixed-holder/';
import SearchFilter from '../truck/filter/';
import $ from '../helper/z';

const SEARCH_FILTER_SUFFIX = '_search_filter';
const ALL = '全部';

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

    let r = assign({
      fromCity: qs.fromCity,
      toCity: qs.toCity,
      entruckTime: qs.entruckTime
    }, qs);

    // 获取本地筛选条件
    let filters = JSON.parse(localStorage.getItem(`${props.pageType}${SEARCH_FILTER_SUFFIX}`));

    if (filters) {
      let _filters = this.transformFilters(filters);

      assign(r, {..._filters});

      // 如果本地筛选条件和查询参数的筛选条件不一致，则更新查询参数
      // 即筛选条件发生改变，更新查询参数
      if (this.freshable(_filters)) {
        location.replace(`${this.state.url}?${querystring.stringify(r)}`);

        return;
      }
    }

    // 若本地无筛选条件，但查询参数有，则更新本地筛选条件
    if (!filters && (qs.truckTypeFlag || qs.loadLimitFlag || qs.truckLengthFlag || qs.useTypeFlag)) {
      let format = (field) => {
        let m = (v) => {
          return { id: v };
        };

        return $.trim(qs[field]) !== '' && qs[field].split(',').map(m) || [];
      }

      localStorage.setItem(`${props.pageType}${SEARCH_FILTER_SUFFIX}`, JSON.stringify({
        selectedUseTypes: format('useTypeFlag'),
        selectedTruckTypes: format('truckTypeFlag'),
        selectedLoadLimits: format('loadLimitFlag'),
        selectedTruckLengths: format('truckLengthFlag')
      }));
    }

    this.setState(r);
  }

  freshable(filters) {
    let qs = this.state.qs;

    return (
      $.trim(qs.truckTypeFlag) !== $.trim(filters.truckTypeFlag) ||
      $.trim(qs.loadLimitFlag) !== $.trim(filters.loadLimitFlag) ||
      $.trim(qs.truckLengthFlag) !== $.trim(filters.truckLengthFlag) ||
      $.trim(qs.useTypeFlag) !== $.trim(filters.useTypeFlag)
    );
  }

  transformFilters(filters) {
    let m = (a, b) => {
      return a.id;
    };

    let truckTypeFlag = (filters.selectedTruckTypes || []).map(m).join(',');
    let loadLimitFlag = (filters.selectedLoadLimits || []).map(m).join(',');
    let truckLengthFlag = (filters.selectedTruckLengths || []).map(m).join(',');
    let useTypeFlag = (filters.selectedUseTypes || []).map(m).join(',');

    return {
      useTypeFlag: useTypeFlag,
      truckTypeFlag: truckTypeFlag,
      loadLimitFlag: loadLimitFlag,
      truckLengthFlag: truckLengthFlag
    };
  }

  componentDidMount() {
    let {
      fromCity, toCity, truckTypeFlag,
      loadLimitFlag, truckLengthFlag, entruckTime
    } = this.state;

    // 页面加载 SearchCondition, 初始化数据
    this.props.init({
      fromCity, toCity, truckTypeFlag,
      loadLimitFlag, truckLengthFlag, entruckTime
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

    this.closeOther(field);

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

      cs.show(top);

      return;
    }

    this.setState({
      showCitySelector: true
    });

    cs.clear();
    cs.show(top);
  }

  getCitySelectorTop(target) {
    let h = $.height(target);

    if (this.props.fixed) {
      return h + 2;
    }

    let pos = $.offset(target);
    return pos.top + h + 2;
  }

  /**
   * 设置地址选择器选择的地址到 state
   * @param {Array} args
   */
  setCitySelectorField(args) {
    let selected = args.filter((arg) => {
      return !!arg && arg !== ALL;
    });

    let val = selected.join(' ');

    this.setState({
      [this.state.citySelectorField]: val
    }, () => {
      let field = this.state.citySelectorField;
      let qs = querystring.stringify(assign({}, this.state.qs, {
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

  /**
   * 处理取消选择
   */
  handleCancelSelectCity(...args) {
    if (args.length && args[0]) {
      this.setCitySelectorField(args);

      this.refs.citySelector.writeHistory2Local({
        province: args[0],
        city: args[1] == ALL ? null : args[1],
        area: args[2] == ALL ? null : args[2]
      });
    }

    this.setState({
      showCitySelector: false
    });
  }

  getAddress(s) {
    if ($.trim(s) === '') {
      return;
    }

    let sArr = s.split(' ');
    return sArr[sArr.length - 1];
  }

  handleShowDatepicker() {
    this.closeOther('entruckTimeOn');
    this.refs.datepicker.show(new Date());
    this.setState({
      datepickerOn: true
    });
  }

  handleSelectDate(d) {
    let qs = querystring.stringify(assign({}, this.state.qs, {
      entruckTime: DT.format(d)
    }));

    // 更新 url querystring
    location.replace(`${this.state.url}?${qs}`);
  }

  handleSelectAllDate() {
    let d = {
      entruckTime: null
    };
    this.setState(d, () => {
      let qs = querystring.stringify(assign({}, this.state.qs, d));

      location.replace(`${this.state.url}?${qs}`);
    });
  }

  handleCloseSelectDate() {
    this.setState({
      datepickerOn: false
    });
  }

  // 切换更多 popup
  toggleSearchFilter() {
    this.closeOther('filters');

    let top = this.getCitySelectorTop(this.refs.filtersField);

    let on = !this.state.searchFilterOn;
    let d = {
      searchFilterOn: on
    };
    if (!on) {
      return this.setState(d);
    }
    this.setState(assign(d, {
      searchFilterTop: top
    }));
  }

  handleSearchFilterDone(filters) {
    let _filters = this.transformFilters(filters);
    let qs = this.state.qs;

    if (this.freshable(_filters)) {
      location.replace(`${this.state.url}?${querystring.stringify(assign({}, qs, _filters))}`);

      return;
    }
  }

  closeOther(curr) {
    if (this.fromCityOn() && curr !== 'fromCity') {
      return this.toggleCitySelector('fromCity');
    }

    if (this.toCityOn() && curr !== 'toCity') {
      return this.toggleCitySelector('toCity');
    }

    if (this.state.searchFilterOn && curr !== 'filters') {
      return this.setState({
        searchFilterOn: false
      });
    }

    if (this.state.datepickerOn && curr !== 'entruckTime') {
      return this.refs.datepicker.close();
    }
  }

  fromCityOn() {
    return this.state.showCitySelector && this.state.citySelectorField === 'fromCity';
  }

  toCityOn() {
    return this.state.showCitySelector && this.state.citySelectorField === 'toCity';
  }

  filtersOn() {
    let st = this.state;

    return st.truckTypeFlag || st.truckLengthFlag || st.loadLimitFlag || st.useTypeFlag;;
  }

  entruckTimeOn() {
    return !!this.state.entruckTime;
  }

  render() {
    let states = this.state;
    let props = this.props;
    let fromCityOn = this.fromCityOn();
    let toCityOn = this.toCityOn();
    let filtersOn = this.filtersOn();
    let entruckTimeOn = this.entruckTimeOn();

    let fromCity = this.getAddress(this.state.fromCity) || '出发地点';
    let toCity = this.getAddress(this.state.toCity) || '到达地点';

    let entruckTime = states.entruckTime;
    let entruckTimeObj = new Date(entruckTime);
    let entruckTimeStr = entruckTime ? DT.format(entruckTimeObj, 'MM-DD') : '可装车时间';
    let fixedHolder = this.props.fixed ? <FixedHolder height="41" /> : null;

    return (
      <div className="search-condition">
        <ul
          className="filters row"
          style={{
            position: this.props.fixed ? 'fixed' : 'relative'
          }}
        >
          <li
            className={fromCityOn && 'on'}
            ref="fromCityField"
            onClick={this.toggleCitySelector.bind(this, 'fromCity')}>
            <a href="javascript:void(0)">
              <span>{fromCity}</span>
              <i className={cx('icon icon-spread s10', fromCityOn && 'teal' || '' )}></i>
            </a>
          </li>
          <li
            className={toCityOn && 'on'}
            ref="toCityField"
            onClick={this.toggleCitySelector.bind(this, 'toCity')}>
            <a href="javascript:void(0)">
              <span>{toCity}</span>
              <i className={cx('icon icon-spread s10', toCityOn && 'teal' || '' )}></i>
            </a>
          </li>
          <li
            className={entruckTimeOn && 'on'}
            onClick={this.handleShowDatepicker.bind(this)}>
            <a href="javascript:void(0)">
              <span>{entruckTimeStr}</span>
              <i className={cx('icon icon-spread s10', entruckTimeOn && 'teal' || '' )}></i>
            </a>
          </li>
          <li
            className={filtersOn && 'on'}
            ref="filtersField"
            onClick={this.toggleSearchFilter.bind(this)}>
            <a href="javascript:;">
              <span>更多</span>
              <i className={cx('icon icon-spread s10', filtersOn && 'teal' || '' )}></i>
            </a>
          </li>
        </ul>
        {fixedHolder}
        <SearchFilter
          ref="searchFilter"
          pageType={props.pageType}
          top={this.state.searchFilterTop}
          on={this.state.searchFilterOn}
          cancel={this.toggleSearchFilter.bind(this)}
          close={this.toggleSearchFilter.bind(this)}
          done={this.handleSearchFilterDone.bind(this)}
          filters={props.filters}
        />
        <CitySelector
          ref="citySelector"
          prefix={props.pageType}
          done={this.handleSelectCityDone.bind(this)}
          onCancel={this.handleCancelSelectCity.bind(this)}
        />
        <DatePicker
          ref="datepicker"
          useAll={true}
          onSelect={this.handleSelectDate.bind(this)}
          onSelectAll={this.handleSelectAllDate.bind(this)}
          onClose={this.handleCloseSelectDate.bind(this)} />
      </div>
    );
  }
}
