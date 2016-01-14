import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import EditableMiniTruckItem from './editable-mini-truck-item/';
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
        <div className="truck-list">
          <EditableMiniTruckItem />
          <EditableMiniTruckItem />
          <EditableMiniTruckItem />
          <EditableMiniTruckItem />
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
