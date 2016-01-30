/**
 * 货源搜索页面 - 用户角色是车主 Trucker
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
import SearchCondition from '../../condition/';
import SearchItem from '../search-item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Log from '../../log/';

const PAGE_TYPE = 'trucker_page';

export default class SearchPkgPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 20,
    pkgs: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    LoadMore.init(() => {
      if (!this.state.over) {
        this.query();
      }
    });
  }

  handleSearchConditionInit(q) {
    this.setState(q, () => {
      this.query();
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
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('查询货源失败,请重试');
    }).done(() => {
      this.refs.loading.close();
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
        <SearchCondition
          pageType={PAGE_TYPE}
          init={this.handleSearchConditionInit.bind(this)}
        />
        <div className="pkg-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<SearchPkgPage />, $('#page').get(0));
