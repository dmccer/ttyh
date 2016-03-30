import '../../../less/global/global.less';
import '../../../less/global/form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';
import querystring from 'querystring';
import keys from 'lodash/object/keys';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';
import findIndex from 'lodash/array/findIndex';

import AH from '../../helper/ajax';
import {
  TruckTypes,
  TruckSearchLengths,
  TruckLoadLimits
} from '../model/';
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

  constructor() {
    super();
  }

  transform(m) {
    return keys(m).map(key => {
      return {
        name: m[key],
        id: key
      };
    });
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    let pageType = this.state.qs.type;

    if (!pageType) {
      throw new Error('缺少页面类型参数');
    }

    this.ah.all([TruckTypes, TruckSearchLengths, TruckLoadLimits], {
      success: (res) => {
        let selected = JSON.parse(localStorage.getItem(`${pageType}${SEARCH_FILTER_SUFFIX}`)) || {};

        this.setState(assign({}, selected, {
          truckTypes: this.transform(res[0].truckTypeMap),
          truckLengths: this.transform(res[1].searchLengthList),
          loadLimits: this.transform(res[2].loadLimitList)
        }));
      },
      error: () => {
        this.refs.poptip.warn('获取车型、载重、车长失败, 请重试');
      }
    });
  }

  renderTruckTypeList() {
    if (this.state.truckTypes && this.state.truckTypes.length) {
      return this.state.truckTypes.map((truckType) => {
        let has = find(this.state.selectedTruckTypes, (selectedTruckType) => {
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
        let has = find(this.state.selectedLoadLimits, (loadLimit) => {
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
        let has = find(this.state.selectedTruckLengths, (truckLength) => {
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

    let index = findIndex(selected , (s) => {
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

ReactDOM.render(<SearchFilterPage />, document.querySelector('.page'));
