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

  fetchTruckList() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruck',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      console.log(res.truckList);
    }).catch(() => {
      this.refs.poptip.warn('获取车辆列表失败,请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

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

  renderTruckList() {
    if (this.state.trucks.length) {
      let truckList = this.state.trucks.map((truck, index) => {
        return <TruckItem key={`truck-item_${index}`} {...truck} />
      });

      return (
        <div className="my-truck">
          <div className="all-recommend-pkg">
            <a href="#">一键查看全部推荐货源</a>
          </div>
          <div className="truck-list">
            {truckList}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="my-truck-page">
        {this.renderEmpty()}
        {this.renderTruckList()}
        <a className="pub-btn">发布</a>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}

ReactDOM.render(<MyTruckPage />, $('#page').get(0));
