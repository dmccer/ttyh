/**
 * 我发布的车源页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TruckItem from '../item/';
import truckPNG from '../../../img/app/truck@3x.png';

export default class MyTruckPage extends Component {
  state = {
    trucks: [{}]
  };

  constructor() {
    super();
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
      return (
        <div className="my-truck">
          <div className="all-recommend-pkg">
            <a href="#">一键查看全部推荐货源</a>
          </div>
          <div className="truck-list">
            <TruckItem />
            <TruckItem />
            <TruckItem />
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
      </div>
    );
  }
}

ReactDOM.render(<MyTruckPage />, $('#page').get(0));
