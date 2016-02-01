/**
 * 今日平台发布货源列表页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';

import LoadMore from '../../load-more/';
import SearchItem from '../search/item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

export default class TodayTruckListPage extends Component {
  state = {
    pageIndex: 0,
    pageSize: 20,
    rtrucks: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.query();

    LoadMore.init(() => {
      if (!this.state.over) {
        this.query();
      }
    });
  }

  query() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/todayRecommendUsersForH5',
        type: 'GET',
        cache: false,
        data: {
          pageIndex: this.state.pageIndex,
          pageSize: this.state.pageSize
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let rtrucks = this.state.rtrucks;

      if (!res.data || !res.data.length) {
        if (!rtrucks.length) {
          // 空列表，没有数据
          return;
        }

        this.refs.poptip.info('没有更多了');

        this.setState({
          over: true
        });

        return;
      }

      rtrucks = rtrucks.concat(res.data);

      this.setState({
        rtrucks: rtrucks,
        pageIndex: this.state.pageIndex + 1
      });
    }).catch(() => {
      this.refs.poptip.warn('查询货源失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  renderItems() {
    let rtrucks = this.state.rtrucks;

    if (rtrucks && rtrucks.length) {
      return rtrucks.map((rtruck, index) => {
        return <SearchItem key={`pkg-item_${index}`} {...rtruck} />
      });
    }
  }

  render() {
    return (
      <div className="search-truck-page">
        <div className="truck-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<TodayTruckListPage />, $('#page').get(0));
