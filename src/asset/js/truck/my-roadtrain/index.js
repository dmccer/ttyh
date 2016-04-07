import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';
import find from 'lodash/collection/find';

import MiniTruckItem from '../roadtrain/mini-truck-item/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Log from '../../log/';
import AH from '../../helper/ajax';
import Detect from '../../helper/detect';
import {
  MyTrucks,
  DelTruck
} from '../model/';

const DEFAULT_TRUCK = 'default-truck';
const ERR_MSG_GET_TRUCK = {
  1001: '您没有登录',
  1002: '您没有登录'
};
const ERR_MSG_DEL = {
  1001: '请选择车辆',
  1003: '您没有登录'
};

export default class RoadtrainPage extends React.Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    trucks: [],
    lastDefaultTruck: JSON.parse(localStorage.getItem(DEFAULT_TRUCK))
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.ah.one(MyTrucks, {
      success: (res) => {
        if (res.retcode != 0) {
          this.refs.poptip.warn(ERR_MSG_GET_TRUCK[res.retcode]);

          return;
        }

        let selected = find(res.truckList, (truck) => {
          return truck.isDefault === 1;
        });

        this.setState({
          trucks: res.truckList,
          selected: selected
        });
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('加载我的车队失败');
      }
    });
  }

  del(id) {
    this.ah.one(DelTruck, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(ERR_MSG_DEL[res.retcode]);

          return;
        }

        let trucks = this.state.trucks;
        let truck = find(trucks, (truck) => {
          return truck.truckID === id;
        });

        trucks.splice(trucks.indexOf(truck), 1);

        this.setState({
          trucks: trucks
        });

        // 删除当前选中的默认项
        if (this.state.selected.truckID === id) {
          this.state.selected = null;
        }

        if (this.state.lastDefaultTruck.truckID === id) {
          localStorage.removeItem(DEFAULT_TRUCK);
        }

        this.refs.poptip.success('删除车辆成功');
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('删除车辆失败，请重试');
      }
    }, id);

    return false;
  }

  renderTruckList() {
    if (this.state.trucks.length) {
      return this.state.trucks.map((truck, index) => {
        let telLink = Detect.isWeiXin() || true? (
          <div className="tel">
            <a href={`tel:${truck.dirverPoneNo}`} className="icon icon-call s30"></a>
          </div>
        ) : null;

        return (
          <div className="item row" key={`truck-item_${index}`}>
            <a className="info-part" href={`./truck-add.html?tid=${truck.truckID}`}>
              <MiniTruckItem
                {...truck}
                del={this.del.bind(this)}
              />
            </a>
            {telLink}
          </div>
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

ReactDOM.render(<RoadtrainPage />, document.querySelector('.page'));
