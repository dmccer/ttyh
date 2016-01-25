/**
 * 货源搜索页面
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import CitySelector from '../../city-selector/';
import SearchItem from '../search-item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

const PKG_SEARCH = 'pkg-search';
const CITY_SELECTOR_PREFIX = 'trucker_';
const SEARCH_FILTER_PREFIX = 'search_filter_';
const PAGE_TYPE = 'pkg';

export default class SearchPkgPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentWillMount() {
    let filters = JSON.parse(localStorage.getItem(`${SEARCH_FILTER_PREFIX}${PAGE_TYPE}`));
    let r = {
      fromCity: this.state.qs.fromCity,
      toCity: this.state.qs.toCity,
    };

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
          truckLengthFlag: this.state.truckLengthFlag
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        pkgs: res.data
      });
    }).catch(() => {
      this.refs.poptip.warn('查询货源失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  toggleCitySelector(field, e) {
    e.preventDefault();
    e.stopPropagation();

    let offset = $(e.currentTarget).offset();
    let top = offset.top + offset.height;

    this.setState({
      citySelectorTop: top,
      citySelectorField: field,
      showCitySelector: true
    });
  }

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

  handleSelectCityDone(...args) {
    this.setCitySelectorField(args);
  }

  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  renderItems() {
    let pkgs = this.state.pkgs;

    if (pkgs && pkgs.length) {
      return pkgs.map((pkg, index) => {
        return <SearchItem key={`pkg-item_${index}`} {...pkg} />
      });
    }
  }

  render() {
    return (
      <div className="search-pkg-page">
        <ul className="filters row">
          <li onClick={this.toggleCitySelector.bind(this, 'fromCity')}>
            <a href="javascript:void(0)">
              <i className="icon icon-start-point off s20"></i>
              <span>出发地点</span>
            </a>
          </li>
          <li onClick={this.toggleCitySelector.bind(this, 'toCity')}>
            <a href="javascript:void(0)">
              <i className="icon icon-end-point off s20"></i>
              <span>到达地点</span>
            </a>
          </li>
          <li>
            <a href={`./search-filter.html?type=${PAGE_TYPE}`}>
              <i className="icon condition off s20"></i>
              <span>筛选</span>
            </a>
          </li>
        </ul>
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

ReactDOM.render(<SearchPkgPage />, $('#page').get(0));
