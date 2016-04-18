/**
 * 今日平台发布货源列表页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import LoadMore from '../../load-more/';
import SearchItem from '../search/item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Confirm from '../../confirm/';
import AH from '../../helper/ajax';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';
import {TodayRecommendTruckRoutes} from '../model/';


injectTapEventPlugin();

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
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.query();

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
    this.ah.one(TodayRecommendTruckRoutes, {
      success: (res) => {
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
      },
      error: () => {
        this.refs.poptip.warn('查询货源失败,请重试');
      }
    }, {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
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

  renderItems() {
    let rtrucks = this.state.rtrucks;

    if (rtrucks && rtrucks.length) {
      return rtrucks.map((rtruck, index) => {
        return (
           <SearchItem
             verifyTip={this.handleShowVerifyTip.bind(this)}
             key={`pkg-item_${index}`}
             {...rtruck} />
        );
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

ReactDOM.render(<TodayTruckListPage />, document.querySelector('.page'));
