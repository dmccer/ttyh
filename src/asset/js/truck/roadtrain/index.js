import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import EditableMiniTruckItem from './editable-mini-truck-item/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';

export default class RoadtrainPage extends React.Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    trucks: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/my_roadtrain',
        type: 'GET',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.setState({
        trucks: res.trucks
      });
    }).catch(() => {
      this.refs.poptip.warn('加载我的车队失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  del(id) {
    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/del_truck',
        type: 'POST',
        data: {
          id: id
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.refs.poptip.success('删除车辆成功');

      let trucks = this.state.trucks;
      let truck = trucks.find((truck) => {
        return truck.id === id;
      });

      trucks.splice(trucks.indexOf(truck), 1);

      this.setState({
        trucks: trucks
      });
    }).catch(() => {
      this.refs.poptip.warn('删除车辆失败，请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  renderTruckList() {
    if (this.state.trucks.length) {
      return this.state.trucks.map((truck, index) => {
        return (
          <EditableMiniTruckItem
            key={`truck-item_${index}`}
            {...truck}
            del={this.del.bind(this)}
          />
        );
      });
    }
  }

  render() {
    return (
      <section className="roadtrain-page">
        <div className="truck-list">
          {this.renderTruckList()}
        </div>
        <div className="add-truck-btn">
          <a href="./truck-add.html">
            <i className="icon s20 icon-big-plus"></i>
            <span>添加车辆</span>
          </a>
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<RoadtrainPage />, $('#page').get(0));
