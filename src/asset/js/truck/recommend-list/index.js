/**
 * 推荐车源页面
 */
import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RecommendTruckItem from './item/';
import truckPNG from '../../../img/app/truck@3x.png';

export default class RecommendTruckListPage extends Component {
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
          <p>还没有找到车源</p>
        </div>
      );
    }
  }

  renderTruckList() {
    if (this.state.trucks.length) {
      return (
        <div className="truck-list">
          <RecommendTruckItem />
          <RecommendTruckItem />
          <RecommendTruckItem />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="recommend-truck-list-page">
        {this.renderEmpty()}
        {this.renderTruckList()}
      </div>
    );
  }
}

ReactDOM.render(<RecommendTruckListPage />, $('#page').get(0));
