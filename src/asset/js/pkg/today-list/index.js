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
import AH from '../../helper/ajax';
import {
  TodayRecommendPkgs
} from '../model/';

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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.query();

    LoadMore.init(() => {
      if (!this.state.over) {
        this.query();
      }
    });
  }

  query() {
    this.ah.one(TodayRecommendPkgs, {
      success: (res) => {
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
      },
      error: () => {
        this.refs.poptip.warn('查询货源失败,请重试');
      }
    }, {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
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

ReactDOM.render(<TodayPkgListPage />, document.querySelector('.page'));
