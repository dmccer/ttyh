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
import SearchCondition from '../../condition';
import SearchItem from './item/';
import Log from '../../log/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

const PAGE_TYPE = 'shipper_page';

export default class SearchTruckPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 20,
    trucks: []
  };

  constructor() {
    super();
  }

  handleSearchConditionInit(q) {
    this.setState(q, () => {
      this.query();
    });
  }

  componentDidMount() {
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
        url: '/mvc/searchUsersForH5',
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
      let trucks = this.state.trucks;

      if (!res.trucks || !res.trucks.length) {
        if (!trucks.length) {
          // 空列表，没有数据
          return;
        }

        this.refs.poptip.info('没有更多了');

        this.setState({
          over: true
        });

        return;
      }

      trucks = trucks.concat(res.trucks);

      this.setState({
        trucks: trucks,
        pageIndex: this.state.pageIndex + 1
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('查询车源失败,请重试');
    }).done(() => {
      this.refs.loading.close();
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
        <SearchCondition
          pageType={PAGE_TYPE}
          init={this.handleSearchConditionInit.bind(this)}
        />
        <div className="truck-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<SearchTruckPage />, $('#page').get(0));
