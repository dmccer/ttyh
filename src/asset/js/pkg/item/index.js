import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

import {MiniReadableTime} from '../../bbs/readable-time/'
import PkgItemDesc from '../item-desc/';

export default class PkgItem extends Component {
  constructor() {
    super();
  }

  render() {
    let props = this.props;
    let pkg = this.props.product || {};

    return (
      <div className="pkg-item">
        <div className="title">
          <span>{pkg.fromCity}</span>
          <i className="icon icon-target"></i>
          <span>{pkg.toCity}</span>
        </div>
        <div className="detail">
          <PkgItemDesc {...pkg} />
          {
            // <a href="#" className="recommend">
            //   <i className="flag orange">3 推荐 >></i>
            // </a>
          }
        </div>
        <div className="extra">
          <ul className="actions">
            <li onClick={props.repub}><a href="#">重新发布</a></li>
            <li><a href={`./pkg-detail.html?pid=${pkg.productID}`}>详情</a></li>
            <li onClick={props.del}><a href="#">删除</a></li>
          </ul>
          <div className="pub-time"><MiniReadableTime time={pkg.createTime}/>发布</div>
        </div>
      </div>
    );
  }
}
