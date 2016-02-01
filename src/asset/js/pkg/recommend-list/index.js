/**
 * 推荐货源页面
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
import RecommendPkgItem from '../recommend-item/';
import pkgPNG from '../../../img/app/pkg@3x.png';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Log from '../../log/';


export default class RecommendPkgListPage extends Component {
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
        this.query(this.state.pageIndex);
      }
    });
  }

  query() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/todayRecommendProductForH5',
        type: 'GET',
        cache: false,
        data: {
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
        return <RecommendPkgItem key={`pkg-item_${index}`} {...pkg} />
      });
    }
  }

  renderEmpty() {
    if (!this.state.pkgs.length) {
      return (
        <div className="pkg-empty-tip">
          <p>没有找到货源</p>
        </div>
      );
    }
  }

  renderPkgList() {
    if (this.state.pkgs.length) {
      return (
        <div className="pkg-list">
          {this.renderEmpty()}
          {this.renderItems()}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="recommend-pkg-list-page">
        {this.renderEmpty()}
        {this.renderPkgList()}
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<RecommendPkgListPage />, $('#page').get(0));
