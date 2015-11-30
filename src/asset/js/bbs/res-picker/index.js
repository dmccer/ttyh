import '../../../less/global/layout.less';
import './index.less';

import React from 'react';

export default class ResPicker extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="res-picker">
        <ul className="grid picked-tag">
          <li className="topic-tag">
            <span className="action-tag"><i className="icon icon-card"></i>话题标题<i className="icon icon-minus round yellow action-icon">-</i></span>
          </li>
          <li className="location-tag">
            <span className="action-tag"><i className="icon icon-address"></i>显示位置<i className="icon icon-plus round teal action-icon">+</i></span>
          </li>
        </ul>
        <ul className="res-menus">
          <li><a href="#topic">话题</a></li>
          <li><a href="#emoj">表情</a></li>
          <li><a href="#photo">图片</a></li>
        </ul>
        <ul className="res-list hide">
          <li className="emoj"></li>
          <li className="photo"></li>
        </ul>
      </div>
    )
  }
}
