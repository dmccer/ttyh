import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import EditableMiniTruckItem from './editable-mini-truck-item/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Log from '../../log/';

const DEFAULT_TRUCK = 'default-truck';
const ERR_MSG_GET_TRUCK = {
  1001: '您没有登录',
  1002: '您没有登录'
};
const ERR_MSG_DEL = {
  1001: '请选择车辆',
  1003: '您没有登录'
}
const ERR_MSG_SET_DEFAULT = {
  1001: '您没有登录',
  1002: '您没有登录',
  1003: '设置默认失败',
  1004: '设置默认失败'
}

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
        url: '/mvc/v2/getTruck',
        type: 'POST',
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode != 0) {
        this.refs.poptip.warn(ERR_MSG_GET_TRUCK[res.retcode]);

        return;
      }

      this.setState({
        trucks: res.truckList
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('加载我的车队失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  del(id) {
    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/deleteTruck',
        type: 'POST',
        data: {
          truckID: id
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG_DEL[res.retcode]);

        return;
      }

      this.refs.poptip.success('删除车辆成功');

      let trucks = this.state.trucks;
      let truck = trucks.find((truck) => {
        return truck.truckID === id;
      });

      trucks.splice(trucks.indexOf(truck), 1);

      this.setState({
        trucks: trucks
      });
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('删除车辆失败，请重试');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  handleSelect(truck, e) {
    e.preventDefault();
    e.stopPropagation();

    let trucks = this.state.trucks;

    trucks.forEach((truck) => {
      truck.isDefault = 0;
    });

    truck.isDefault = 1;

    this.setState({
      trucks: trucks,
      selected: truck
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
            select={this.handleSelect.bind(this, truck)}
          />
        );
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/setTruckDefalt',
        type: 'POST',
        data: {
          truckID: this.state.selected.truckID
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG_SET_DEFAULT[res.retcode]);
        return;
      }

      localStorage.setItem(DEFAULT_TRUCK, JSON.stringify(this.state.selected));
      history.back();
    }).catch((err) => {
      Log.error(err);

      this.refs.poptip.warn('设置默认车辆失败');
    }).done(() => {
      this.refs.loading.close();
    });
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
        <div className="fixed-holder"></div>
        <div className="confirm-btn">
          <button className="btn block teal" onClick={this.handleSubmit.bind(this)}>确定选择</button>
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<RoadtrainPage />, $('#page').get(0));
