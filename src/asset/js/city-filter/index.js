/**
 * 搜索条件
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 * Usage:
 *
 * const PAGE_TYPE = 'trucker_page';
 *
 * function handleCityFilterInit(condition) {
 * 		// fetch data with condition
 * }
 *
 * <CityFilter
 * 	pageType={PAGE_TYPE}
 * 	init={this.handleCityFilterInit.bind(this)}
 * />
 */
import '../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';

import CitySelector from '../city-selector/';
import FixedHolder from '../fixed-holder/';
import $ from '../helper/z';

const SEARCH_FILTER_SUFFIX = '_search_filter';
const ALL = '全部';

export default class CityFilter extends Component {
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
      toCity: qs.toCity
    };

    this.setState(r);
  }

  componentDidMount() {
    let {
      fromCity, toCity
    } = this.state;
    // 页面加载 SearchCondition, 初始化数据
    this.props.init({
      fromCity, toCity
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
    let pos = $.position(target);
    let h = $.height(target);

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

  render() {
    let states = this.state;
    let props = this.props;
    let fromCityOn = this.state.showCitySelector && this.state.citySelectorField === 'fromCity';
    let toCityOn = this.state.showCitySelector && this.state.citySelectorField === 'toCity';

    let fromCity = this.getAddress(this.state.fromCity) || '出发地点';
    let toCity = this.getAddress(this.state.toCity) || '到达地点';

    let fixedHolder = this.props.fixed ? <FixedHolder height="41" /> : null;

    return (
      <div className="search-condition">
        <ul className="filters row" style={{
          position: this.props.fixed ? 'fixed' : 'relative'
        }}>
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
        </ul>
        {fixedHolder}
        <CitySelector
          ref="citySelector"
          prefix={props.pageType}
          done={this.handleSelectCityDone.bind(this)}
          onCancel={this.handleCancelSelectCity.bind(this)}
        />
      </div>
    );
  }
}
