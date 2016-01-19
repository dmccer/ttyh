import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

export default class TruckItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="truck-item">
        <div className="title">
          <i className="flag teal">顺风车</i>
          <span>浦东新区</span>
          <b>(5)</b>
          <i className="icon icon-target"></i>
          <span>海淀区</span>
          <b>(3)</b>
        </div>
        <div className="detail">
          <div className="row">
            <div className="truck-desc-col">
              <p className="truck-desc">上海到哪里的货，天天有货为您服务，长期合作请联系我们</p>
            </div>
            <div className="recommend-col">
              <a href="#" className="recommend">
                <i className="flag orange">99 推荐 >></i>
              </a>
            </div>
          </div>
          <p><b>AU8998 厢式 3.3米 2.9吨</b></p>
        </div>
        <div className="extra">
          <ul className="actions">
            <li><a href="#">重新发布</a></li>
            <li><a href="#">详情</a></li>
            <li><a href="#">删除</a></li>
          </ul>
          <span>1小时前发布</span>
        </div>
      </div>
    );
  }
}
