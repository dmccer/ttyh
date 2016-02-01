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
import injectTapEventPlugin from 'react-tap-event-plugin';

import LoadMore from '../../load-more/';
import SearchItem from '../search-item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

const PKG_SEARCH = 'pkg-search';

injectTapEventPlugin();

export default class TodayPkgListPage extends Component {
  state = {
    pageIndex: 0,
    pageSize: 20,
    pkgs: []
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
        url: '/mvc/todayRecommendProductsForH5',
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
        <div className="pkg-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<TodayPkgListPage />, $('#page').get(0));
