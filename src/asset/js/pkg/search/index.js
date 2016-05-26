/**
 * 货源搜索页面 - 用户角色是车主 Trucker
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import querystring from 'querystring';
import assign from 'lodash/object/assign';
import EventListener from 'fbjs/lib/EventListener';
import injectTapEventPlugin from 'react-tap-event-plugin';

import LoadMore from '../../load-more/';
import SearchCondition from '../../condition/';
import SearchItem from '../search-item/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Confirm from '../../confirm/';
import IconMenu from '../../icon-menu/';
import Log from '../../log/';
import pkgPNG from '../../../img/app/pkg@3x.png';
import PkgMaluationPanel from '../maluation/';
import AH from '../../helper/ajax';
import $ from '../../helper/z';
import {OrderedEnumValue} from '../../model/';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';
import {
  MENUS
} from '../../const/pkg';
import {
  PkgSearch,
  Maluation
} from '../model/';

injectTapEventPlugin();

const PAGE_TYPE = 'trucker_page';

export default class SearchPkgPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 20,
    pkgs: [],
    maluationItems: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    let searchConditionEl = findDOMNode(this.refs.searchCondition);
    let offset = $.offset(searchConditionEl);
    let delta = offset.top;

    EventListener.listen(window, 'scroll', () => {
      let t = $.scrollTop(window);

      if (t >= delta && !this.state.fixedCondition) {
        this.setState({
          fixedCondition: true
        });

        return;
      }

      if (t < delta && this.state.fixedCondition) {
        this.setState({
          fixedCondition: false
        });

        return;
      }
    });
  }

  handleSearchConditionInit(q) {
    this.setState(assign({
      filterLoaded: true
    }, q), () => {
      this.ah = new AH(this.refs.loading, this.refs.poptip);

      LoadMore.init(() => {
        if (!this.state.over) {
          this.query();
        }
      });
      this.fetchUserInfo();

      this.query();
    });
  }

  fetchUserInfo() {
    this.ah.one(UserVerifyStatus, (res) => {
      this.setState({
        realNameVerifyStatus: res.auditStatus
      });
    });
  }

  query() {
    this.ah.one(PkgSearch, {
      success: (res) => {
        let pkgs = this.state.pkgs;

        this.setState({
          loaded: true
        });

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
      useType: this.state.useTypeFlag,
      truckTypeFlags: this.state.truckTypeFlag,
      loadLimitFlags: this.state.loadLimitFlag,
      truckLengthFlags: this.state.truckLengthFlag,
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex
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

  /**
   * 展示货源为空时的提示界面
   * @return {Element}
   */
  renderEmpty() {
    if (!this.state.pkgs.length && this.state.loaded) {
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
        return (
          <SearchItem
            verifyTip={this.handleShowVerifyTip.bind(this)}
            key={`pkg-item_${index}`}
            {...pkg} />
        );
      });
    }

    return this.renderEmpty();
  }

  render() {
    let list = this.state.filterLoaded ? (
      <div className="pkg-list">
        {this.renderItems()}
      </div>
    ) : null;

    return (
      <div className="search-pkg-page">
        <IconMenu menus={MENUS} />
        <SearchCondition
          ref="searchCondition"
          pageType={PAGE_TYPE}
          init={this.handleSearchConditionInit.bind(this)}
          fixed={this.state.fixedCondition}
          filters={['useTypes', 'truckTypes', 'loadLimits', 'truckLengths']}
        />
        {list}
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

ReactDOM.render(<SearchPkgPage />, document.querySelector('.page'));
