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

export default class SearchPkgPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentWillMount() {
    this.setState({
      startPoint: this.state.qs.startPoint,
      endPoint: this.state.qs.endPoint
    });
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/pkg_search',
        type: 'GET',
        data: {
          fromCity: this.state.startPoint,
          toCity: this.state.endPoint
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        pkgs: res.pkgs
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

    this.setState({
      [this.state.citySelectorField]: selected.join(' ')
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
          <li onClick={this.toggleCitySelector.bind(this, 'startPoint')}>
            <a href="javascript:void(0)">
              <i className="icon icon-start-point off s20"></i>
              <span>出发地点</span>
            </a>
          </li>
          <li onClick={this.toggleCitySelector.bind(this, 'endPoint')}>
            <a href="javascript:void(0)">
              <i className="icon icon-end-point off s20"></i>
              <span>到达地点</span>
            </a>
          </li>
          <li>
            <a href="./search-filter.html">
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
          done={this.handleSelectCityDone.bind(this)}
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
      </div>
    );
  }
}

ReactDOM.render(<SearchPkgPage />, $('#page').get(0));
