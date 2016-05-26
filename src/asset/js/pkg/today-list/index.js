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
import SearchItem from '../search-item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import PkgMaluationPanel from '../maluation/';
import Confirm from '../../confirm/';
import AH from '../../helper/ajax';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';

import {
  TodayRecommendPkgs,
  Maluation
} from '../model/';
import {OrderedEnumValue} from '../../model/';

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

  handleShowVerifyTip(pkg, tel) {
    this.setState({
      activeTel: tel
    }, () => {
      let status = this.state.realNameVerifyStatus;

      if (status === 1 || status === 0) {
        this.handleCancelVerify();

        this.setState({
          thePkgIdOfMadeCall: pkg.product.productID
        });

        return;
      }

      this.refs.verifyTip.show({
        title: REAL_NAME_CERTIFY_TITLE,
        msg: REAL_NAME_CERTIFY_TIP_FOR_VIEW
      });
    });
  }

  // handleShowVerifyTip(tel) {
  //   this.setState({
  //     activeTel: tel
  //   }, () => {
  //     let status = this.state.realNameVerifyStatus;
  //
  //     if (status === 1 || status === 0) {
  //       this.handleCancelVerify();
  //       return;
  //     }
  //
  //     this.refs.verifyTip.show({
  //       title: REAL_NAME_CERTIFY_TITLE,
  //       msg: REAL_NAME_CERTIFY_TIP_FOR_VIEW
  //     });
  //   });
  // }

  handleCancelVerify() {
    this.refs.telPanel.show({
      title: '拨打电话',
      msg: this.state.activeTel
    });
  }

  madeCall() {
    if (this.state.maluationItems && this.state.maluationItems.length) {
      this.setState({
        maluationTel: this.state.activeTel,
        maluationId: this.state.thePkgIdOfMadeCall
      }, () => {
        this.refs.pkgMaluation.show();
      });

      return ;
    }

    this.ah.one(OrderedEnumValue, (res) => {
      let list = res.productAppraise;

      list = list.map((item) => {
        return {
          id: item.key,
          name: item.value
        };
      });

      this.setState({
        maluationItems: list,
        maluationTel: this.state.activeTel,
        maluationId: this.state.thePkgIdOfMadeCall
      }, () => {
        this.refs.pkgMaluation.show();
      });
    }, 'productAppraise');
  }

  handleSelectPkgMaluation(maluation) {
    this.ah.one(Maluation, (res) => {
      this.setState({
        thePkgIdOfMadeCall: null
      });

      if (res.retcode === 0) {
        this.refs.poptip.success('感谢您的评价');
        return;
      }

      this.refs.poptip.warn(res.msg);
    }, {
      businessId: this.state.thePkgIdOfMadeCall,
      // 车源 1 | 货源 2
      businessType: 2,
      commentType: maluation.id
    });
  }

  renderItems() {
    let pkgs = this.state.pkgs;

    if (pkgs && pkgs.length) {
      return pkgs.map((pkg, index) => {
        return (
          <SearchItem
            verifyTip={this.handleShowVerifyTip.bind(this)}
            key={`pkg-item_${index}`}
            {...pkg} />
        );
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
          confirm={this.madeCall.bind(this)}
        />
        <PkgMaluationPanel
          ref="pkgMaluation"
          tel={this.state.maluationTel}
          targetId={this.state.maluationId}
          items={this.state.maluationItems}
          onSelected={this.handleSelectPkgMaluation.bind(this)}
        />
      </div>
    );
  }
}

ReactDOM.render(<TodayPkgListPage />, document.querySelector('.page'));
