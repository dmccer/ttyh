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
import truckPNG from '../../../img/app/truck@3x.png';
import AH from '../../helper/ajax';
import {TruckUsers} from '../model/';

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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    LoadMore.init(() => {
      if (!this.state.over) {
        this.query();
      }
    });
  }

  query() {
    this.ah.one(TruckUsers, {
      success: (res) => {
        let trucks = this.state.trucks || [];

        if (!res.data || !res.data.length) {
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

        trucks = trucks.concat(res.data);

        this.setState({
          trucks: trucks,
          pageIndex: this.state.pageIndex + 1
        });
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('查询车源失败,请重试');
      }
    }, {
      fromCity: this.state.fromCity,
      toCity: this.state.toCity,
      truckTypeFlags: this.state.truckTypeFlag,
      loadLimitFlags: this.state.loadLimitFlag,
      truckLengthFlags: this.state.truckLengthFlag,
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex
    });
  }

  /**
   * 展示车源列表为空时的提示
   */
  renderEmpty() {
    if (!this.state.trucks.length) {
      return (
        <div className="truck-empty-tip">
          <div className="img-tip">
            <img src={truckPNG} />
          </div>
          <p>未找到合适车源</p>
        </div>
      );
    }
  }

  renderItems() {
    let trucks = this.state.trucks;

    if (trucks && trucks.length) {
      return trucks.map((truck, index) => {
        return <SearchItem key={`pkg-item_${index}`} {...truck} />
      });
    }

    return this.renderEmpty();
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

ReactDOM.render(<SearchTruckPage />, document.querySelector('.page'));
