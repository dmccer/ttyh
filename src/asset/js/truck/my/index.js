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

import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Log from '../../log/';
import TruckItem from '../item/';
import truckPNG from '../../../img/app/truck@3x.png';

export default class MyTruckPage extends Component {
  state = {
    trucks: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.fetchTruckList();
  }

  /**
   * 获取我的车源列表
   */
  fetchTruckList() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getRouteList',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        trucks: res.routeInfos
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
        url: '/mvc/v2/releaseTruck',
        type: 'POST',
        data: {
          routeID: truck.routeID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode === 0) {
        this.fetchTruckList();
      }
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
    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/closeTruck',
        type: 'POST',
        data: {
          routeID: truck.routeID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode === 0) {
        this.fetchTruckList();
      }
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
        <a href="./truck-pub.html" className="pub-btn">发布</a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<MyTruckPage />, $('#page').get(0));
