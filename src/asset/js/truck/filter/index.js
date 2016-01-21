import '../../../less/global/global.less';
import '../../../less/global/form.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class SearchFilterPage extends Component {
  state = {
    truckTypes: [
      {
        name: '平板',
        id: 1
      }, {
        name: '高栏',
        id: 2
      }, {
        name: '厢式',
        id: 3
      }, {
        name: '面包车',
        id: 4
      }, {
        name: '保温',
        id: 5
      }, {
        name: '冷藏',
        id: 6
      }, {
        name: '危险品',
        id: 7
      }, {
        name: '集装箱',
        id: 8
      }, {
        name: '其他',
        id: 9
      }
    ],
    selectedTruckTypes: []
  };

  constructor() {
    super();
  }

  render() {
    let truckTypeTagList = this.state.truckTypes.map((truckType) => {
      let has = this.state.selectedTruckTypes.find((selectedTruckType) => {
        return selectedTruckType.id === truckType.id;
      });

      return (
        <li key={`truck-type_${truckType.id}`} className={has ? 'on' : ''}>
          <a href="#">
            <span>{truckType.name}</span>
            <i className="icon icon-right"></i>
          </a>
        </li>
      );
    });

    return (
      <div className="search-filter-page">
        <h2 className="subtitle">车型</h2>
        <ul className="tag-list">
          {truckTypeTagList}
        </ul>
        <h2 className="subtitle">载重</h2>
        <ul className="tag-list">
          {truckTypeTagList}
        </ul>
        <h2 className="subtitle">车长</h2>
        <ul className="tag-list">
          {truckTypeTagList}
        </ul>
        <button type="submit" className="btn teal block submit">确定</button>
      </div>
    );
  }
}

ReactDOM.render(<SearchFilterPage />, $('#page').get(0));
