import '../../../less/global/global.less';
import '../../../less/global/form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';
import querystring from 'querystring';

import Poptip from '../../poptip/';
import Loading from '../../loading/';

const SEARCH_FILTER_SUFFIX = '_search_filter';

export default class SearchFilterPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    truckTypes: [],
    selectedTruckTypes: [],
    selectedLoadLimits: [],
    selectedTruckLengths: []
  };

  /**
   * 获取车型列表
   * @return {Promise}
   */
  fetchTruckTypes() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckType',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckTypes = res.truckTypeMap;
      truckTypes = Object.keys(truckTypes).map((key) => {
        return {
          name: truckTypes[key],
          id: key
        };
      });

      return truckTypes;
    });
  }

  /**
   * 获取车长列表
   * @return {Promise}
   */
  fetchTruckLengths() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getSearchLength',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let searchLengths = res.searchLengthList;
      searchLengths = Object.keys(searchLengths).map((key) => {
        return {
          name: searchLengths[key],
          id: key
        };
      });

      return searchLengths;
    });
  }

  /**
   * 获取载重列表
   * @return {Promise}
   */
  fetchLoadLimit() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getLoadLimit',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let loadLimits = res.loadLimitList;

      loadLimits = Object.keys(loadLimits).map((key) => {
        return {
          name: loadLimits[key],
          id: key
        };
      });

      return loadLimits;
    });
  }

  componentDidMount() {
    let pageType = this.state.qs.type;

    if (!pageType) {
      throw new Error('缺少页面类型参数');
    }

    this.refs.loading.show('加载中...');

    Promise
      .all([
        this.fetchTruckTypes(),
        this.fetchLoadLimit(),
        this.fetchTruckLengths()])
      .then((res) => {
        let selected = JSON.parse(localStorage.getItem(`${pageType}${SEARCH_FILTER_SUFFIX}`)) || {};

        this.setState($.extend(selected, {
          truckTypes: res[0],
          loadLimits: res[1],
          truckLengths: res[2]
        }));
      })
      .catch(() => {
        this.refs.poptip.warn('获取车型、载重、车长失败, 请重试');
      })
      .done(() => {
        this.refs.loading.close();
      });
  }

  constructor() {
    super();
  }

  renderTruckTypeList() {
    if (this.state.truckTypes && this.state.truckTypes.length) {
      return this.state.truckTypes.map((truckType) => {
        let has = this.state.selectedTruckTypes.find((selectedTruckType) => {
          return selectedTruckType.id === truckType.id;
        });

        return (
          <li key={`truck-type_${truckType.id}`} className={has ? 'on' : ''}>
            <a href="javascript:void(0)" onClick={this.handleSelectItem.bind(this, 'selectedTruckTypes', truckType)}>
              <span>{truckType.name}</span>
              <i className="icon icon-right"></i>
            </a>
          </li>
        );
      });
    }
  }

  renderLoadlimitList() {
    let list = this.state.loadLimits;

    if (list && list.length) {
      return list.map((item) => {
        let has = this.state.selectedLoadLimits.find((loadLimit) => {
          return loadLimit.id === item.id;
        });

        return (
          <li key={`truck-type_${item.id}`} className={has ? 'on' : ''}>
            <a href="javascript:void(0)" onClick={this.handleSelectItem.bind(this, 'selectedLoadLimits', item)}>
              <span>{item.name}</span>
              <i className="icon icon-right"></i>
            </a>
          </li>
        );
      });
    }
  }

  renderTruckLengthList() {
    let list = this.state.truckLengths;

    if (list && list.length) {
      return list.map((item) => {
        let has = this.state.selectedTruckLengths.find((truckLength) => {
          return truckLength.id === item.id;
        });

        return (
          <li key={`truck-type_${item.id}`} className={has ? 'on' : ''}>
            <a href="javascript:void(0)" onClick={this.handleSelectItem.bind(this, 'selectedTruckLengths', item)}>
              <span>{item.name}</span>
              <i className="icon icon-right"></i>
            </a>
          </li>
        );
      });
    }
  }

  handleSelectItem(field, item) {
    let selected = this.state[field];

    let index = selected.findIndex((s) => {
      return s.id === item.id
    });

    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }

    this.setState({
      [field]: selected
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    let pageType = this.state.qs.type;

    localStorage.setItem(`${pageType}${SEARCH_FILTER_SUFFIX}`, JSON.stringify({
      selectedLoadLimits: this.state.selectedLoadLimits,
      selectedTruckTypes: this.state.selectedTruckTypes,
      selectedTruckLengths: this.state.selectedTruckLengths
    }));

    history.back();
  }

  render() {
    return (
      <div className="search-filter-page">
        <h2 className="subtitle">车型</h2>
        <ul className="tag-list">
          {this.renderTruckTypeList()}
        </ul>
        <h2 className="subtitle">载重</h2>
        <ul className="tag-list">
          {this.renderLoadlimitList()}
        </ul>
        <h2 className="subtitle">车长</h2>
        <ul className="tag-list">
          {this.renderTruckLengthList()}
        </ul>
        <button type="submit" className="btn teal block submit" onClick={this.handleSubmit.bind(this)}>确定</button>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<SearchFilterPage />, $('#page').get(0));
