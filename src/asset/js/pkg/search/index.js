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
import pkgPNG from '../../../img/app/pkg@3x.png';
import AH from '../../helper/ajax';
import {
  PkgSearch
} from '../model/';

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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

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
    this.ah.one(PkgSearch, {
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
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('查询货源失败,请重试');
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
   * 展示货源为空时的提示界面
   * @return {Element}
   */
  renderEmpty() {
    if (!this.state.pkgs.length) {
      return (
        <div className="pkg-empty-tip">
          <div className="img-tip">
            <img src={pkgPNG} />
          </div>
          <p>未找到合适货源</p>
        </div>
      );
    }
  }

  renderItems() {
    let pkgs = this.state.pkgs;

    if (pkgs && pkgs.length) {
      return pkgs.map((pkg, index) => {
        return <SearchItem key={`pkg-item_${index}`} {...pkg} />
      });
    }

    return this.renderEmpty();
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

ReactDOM.render(<SearchPkgPage />, document.querySelector('.page'));
