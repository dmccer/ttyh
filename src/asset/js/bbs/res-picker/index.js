import '../../../less/global/layout.less';
import './index.less';

import React from 'react';
import ImgPicker from './img-picker/';

export default class ResPicker extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="res-picker">
        <ul className="grid picked-tag">
          <li className="topic-tag">
            <div className="action-tag">
              <i className="icon icon-card"></i>
              <span>话题标题</span>
              <i className="icon icon-minus round yellow action-icon"></i>
            </div>
          </li>
          <li className="location-tag">
            <div className="action-tag">
              <i className="icon icon-address"></i>
              <span>显示位置</span>
              <i className="icon icon-plus round teal action-icon"></i>
            </div>
          </li>
        </ul>
        <ul className="res-menus">
          <li><a href="#topic">话题</a></li>
          <li><a href="#emoj">表情</a></li>
          <li><a href="#photo">图片</a></li>
        </ul>
        <section className="res-picker-panel">
          <ImgPicker />
        </section>
      </div>
    )
  }
}
