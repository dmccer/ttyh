/**
 * 我发布的车源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';
import querystring from 'querystring';

import LoadMore from '../../load-more/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Log from '../../log/';
import TruckItem from '../item/';
import truckPNG from '../../../img/app/truck@3x.png';
import FixedHolder from '../../fixed-holder/';

const ERR_MSG_REPUB = {
  1001: '您没有登录',
  1002: '您没有登录',
  1003: '未找到要重新发布的车源',
  1004: '重新发布失败'
};

const ERR_MSG_DEL = {
  1001: '您没有登录',
  1002: '您没有登录',
  1003: '删除车源失败'
};

export default class MyTruckPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    pageIndex: 0,
    pageSize: 15,
    trucks: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    LoadMore.init(() => {
      if (!this.state.over) {
        this.fetchTruckList();
      }
    });

    this.fetchTruckList();
  }

  /**
   * 获取我的车源列表
   */
  fetchTruckList(slient) {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getRouteList',
        type: 'GET',
        data: {
          pageSize: this.state.pageSize,
          pageIndex: this.state.pageIndex
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let trucks = this.state.trucks;

      if (!res.routeInfos || !res.routeInfos.length) {
        if (!trucks.length || slient) {
          // 空列表，没有数据
          return;
        }

        this.refs.poptip.info('没有更多了');

        this.setState({
          over: true
        });

        return;
      }

      trucks = trucks.concat(res.routeInfos);

      this.setState({
        trucks: trucks,
        pageIndex: this.state.pageIndex + 1
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('获取车辆列表失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 重新发布车源
   * @param  {Object} truck 需要重新发布的车源
   * @param  {ClickEvent} e
   */
  repub(truck, e) {
    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('发布中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/routeinfo_refresh_json',
        type: 'POST',
        data: {
          routeID: truck.userWithLatLng.routeID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG_REPUB[res.retcode]);
        return;
      }

      this.refs.poptip.success('重新发布成功');
      this.fetchTruckList(true);
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('重新发布失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 删除车源
   * @param  {Object} truck 需要删除的车源
   * @param  {ClickEvent} e
   */
  del(truck, e) {
    if (!confirm('确认删除该条车源?')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/closeTruck',
        type: 'POST',
        data: {
          routeID: truck.userWithLatLng.routeID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG_DEL[res.retcode]);

        return;
      }

      this.refs.poptip.success('删除成功');
      this.fetchTruckList(true);
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('删除失败,请重试');
    }).done(() => {
      this.refs.loading.close();
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
          <p>还没有发布车源<br />赶快开始发布吧</p>
        </div>
      );
    }
  }

  /**
   * 展示车源列表
   */
  renderTruckList() {
    let trucks = this.state.trucks;

    if (!trucks.length) {
      return;
    }

    let truckList = trucks.map((truck, index) => {
      return (
        <TruckItem
          repub={this.repub.bind(this, truck)}
          del={this.del.bind(this, truck)}
          key={`truck-item_${index}`}
          {...truck}
        />
      );
    });

    return (
      <div className="my-truck">
        {
          // <div className="all-recommend-pkg">
          //   <a href="#">一键查看全部推荐货源</a>
          // </div>
        }
        <div className="truck-list">
          {truckList}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="my-truck-page">
        {this.renderEmpty()}
        {this.renderTruckList()}
        <FixedHolder height="70" />
        <a href="./truck-pub.html" className="pub-btn">发布</a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<MyTruckPage />, $('#page').get(0));
