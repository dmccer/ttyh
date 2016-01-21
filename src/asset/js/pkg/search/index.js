import '../../../less/global/global.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import CitySelector from '../../city-selector/';
import SearchItem from '../search-item/';

export default class SearchPkgPage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="search-pkg-page">
        <ul className="filters row">
          <li>
            <a href="#">
              <i className="icon icon-start-point off s20"></i>
              <span>出发地点</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-end-point off s20"></i>
              <span>到达地点</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon condition off s20"></i>
              <span>筛选</span>
            </a>
          </li>
        </ul>
        <div className="pkg-list">
          <SearchItem />
          <SearchItem />
          <SearchItem />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<SearchPkgPage />, $('#page').get(0));
