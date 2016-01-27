/**
 * 找车 - 车源搜索页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import LoadMore from '../../load-more/';
import CitySelector from '../../city-selector/';
import SearchItem from './item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

const PKG_SEARCH = 'pkg-search';
const CITY_SELECTOR_PREFIX = 'trucker_';
const SEARCH_FILTER_PREFIX = '_search_filter';
const PAGE_TYPE = 'pkg';

export default class SearchTruckPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 20,
    pkgs: []
  };

  constructor() {
    super();
  }

  componentWillMount() {
    let r = {
      fromCity: this.state.qs.fromCity,
      toCity: this.state.qs.toCity,
    };

    // 获取本地筛选条件
    let filters = JSON.parse(localStorage.getItem(`${SEARCH_FILTER_PREFIX}${PAGE_TYPE}`));

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
    }

    this.setState(r);
  }

  componentDidMount() {
    this.query();

    LoadMore.init(() => {
      if (!this.state.over) {
        this.query(this.state.pageIndex);
      }
    });
  }

  query() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/searchProductsForH5',
        type: 'GET',
        data: {
          fromCity: this.state.fromCity,
          toCity: this.state.toCity,
          truckTypeFlag: this.state.truckTypeFlag,
          loadLimitFlag: this.state.loadLimitFlag,
          truckLengthFlag: this.state.truckLengthFlag,
          pageSize: this.state.pageSize,
          pageIndex: this.state.pageIndex
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let pkgs = this.state.pkgs;

      if (!res.data || !res.data.length) {
        if (!pkgs.length) {
          // 空列表，没有数据
          return;
        }

        this.refs.poptip.info('没有更多了');

        this.setState({
          over: true
        });

        return;
      }

      pkgs = pkgs.concat(res.data);

      this.setState({
        pkgs: pkgs,
        pageIndex: this.state.pageIndex + 1
      });
    }).catch(() => {
      this.refs.poptip.warn('查询货源失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 切换展示地址选择器
   * @param  {String} field 设置地址字段名
   * @param  {ClickEvent} e
   */
  toggleCitySelector(field, e) {
    e.preventDefault();
    e.stopPropagation();

    let offset = $(e.currentTarget).offset();
    let top = offset.top + offset.height;

    this.setState({
      citySelectorTop: top,
      citySelectorField: field,
      showCitySelector: !this.state.showCitySelector
    });
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
      let url = location.href.split('?')[0].split('#')[0];
      let field = this.state.citySelectorField;
      let qs = querystring.stringify($.extend(this.state.qs, {
        [`${field}`]: this.state[field]
      }));

      // 更新 url querystring
      location.replace(`${url}?${qs}`);
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
   * 取消地址选择
   */
  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  renderItems() {
    let trucks = this.state.trucks;

    if (trucks && trucks.length) {
      return trucks.map((truck, index) => {
        return <SearchItem key={`pkg-item_${index}`} {...truck} />
      });
    }
  }

  render() {
    return (
      <div className="search-truck-page">

        <div className="pkg-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <CitySelector
          on={this.state.showCitySelector}
          top={this.state.citySelectorTop}
          prefix={CITY_SELECTOR_PREFIX}
          done={this.handleSelectCityDone.bind(this)}
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
      </div>
    );
  }
}

ReactDOM.render(<SearchTruckPage />, $('#page').get(0));
