import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import Poptip from '../../poptip/';
import Loading from '../../loading/';

export default class RoadtrainPage extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = $.extend({
      qs: query
    });
  }

  componentWillMount() {}

  render() {
    return (
      <section className="roadtrain-page">
        <ul className="truck-list">
          <li>
            <a href="#">
              <h3>吉祥</h3>
              <p>AU8998 厢式 3.3米 2吨</p>
              <i className="icon icon-arrow"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <h3>吉祥</h3>
              <p>AU8998 厢式 3.3米 2吨</p>
              <i className="icon icon-arrow"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <h3>吉祥</h3>
              <p>AU8998 厢式 3.3米 2吨</p>
              <i className="icon icon-arrow"></i>
            </a>
          </li>
        </ul>

        <div className="add-truck-btn">
          <a href="#">
            <i className="icon icon-plus"></i>
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
