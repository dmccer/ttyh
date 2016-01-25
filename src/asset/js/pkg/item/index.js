import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';

export default class PkgItem extends Component {
  constructor() {
    super();
  }

  render() {
    // <a href="#" className="recommend">
    //   <i className="flag orange">3 推荐 >></i>
    // </a>
    return (
      <div className="pkg-item">
        <div className="title">
          <span>上海市-浦东新区</span>
          <i className="icon icon-target"></i>
          <span>北京市-海淀区</span>
        </div>
        <div className="detail">
          <p className="pkg-desc">
            <i className="icon icon-pkg-type s18"></i>
            <span>冰激凌</span>
            <span>10吨</span>
            <span>5方</span>
          </p>
          <p className="truck-desc">
            <i className="flag teal">需</i>
            <span>7米</span>
            <span>冷藏车</span>
          </p>
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
