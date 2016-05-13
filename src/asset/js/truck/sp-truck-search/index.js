/**
 * 找车 - 车源搜索页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import querystring from 'querystring';

import LoadMore from '../../load-more/';
import SearchCondition from '../../condition';
import SearchItem from '../search/item/';
import Log from '../../log/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Confirm from '../../confirm/';
import truckPNG from '../../../img/app/truck@3x.png';
import AH from '../../helper/ajax';
import $ from '../../helper/z';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';
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

    document.title = this.state.qs.title;
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

    this.fetchUserInfo();
  }

  fetchUserInfo() {
    this.ah.one(UserVerifyStatus, (res) => {
      this.setState({
        realNameVerifyStatus: res.auditStatus
      });
    });
  }

  query() {
    this.ah.one(TruckUsers, {
      success: (res) => {
        this.setState({
          loaded: true
        });

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

  handleShowVerifyTip(tel) {
    this.setState({
      activeTel: tel
    }, () => {
      let status = this.state.realNameVerifyStatus;

      if (status === 1 || status === 0) {
        this.handleCancelVerify();
        return;
      }

      this.refs.verifyTip.show({
        title: REAL_NAME_CERTIFY_TITLE,
        msg: REAL_NAME_CERTIFY_TIP_FOR_VIEW
      });
    });
  }

  handleCancelVerify() {
    this.refs.telPanel.show({
      title: '拨打电话',
      msg: this.state.activeTel
    });
  }

  /**
   * 展示车源列表为空时的提示
   */
  renderEmpty() {
    if (!this.state.trucks.length && this.state.loaded) {
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
        return (
          <SearchItem
            verifyTip={this.handleShowVerifyTip.bind(this)}
            key={`pkg-item_${index}`}
            {...truck} />
        );
      });
    }

    return this.renderEmpty();
  }

  render() {
    return (
      <div className="search-truck-page">
        <SearchCondition
          ref="searchCondition"
          pageType={PAGE_TYPE}
          init={this.handleSearchConditionInit.bind(this)}
          fixed={true}
        />
        <div className="truck-list">
          {this.renderItems()}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <Confirm
          ref="verifyTip"
          cancel={this.handleCancelVerify.bind(this)}
          rightLink="./real-name-certify.html"
          rightBtnText={'立即认证'}
          leftBtnText={'稍后认证'}
        />
        <Confirm
          ref="telPanel"
          rightLink={`tel:${this.state.activeTel}`}
          rightBtnText={'拨打'}
          leftBtnText={'取消'}
        />
      </div>
    );
  }
}

ReactDOM.render(<SearchTruckPage />, document.querySelector('.page'));
