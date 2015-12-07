import '../../../less/global/layout.less';
import './index.less';

import React from 'react';
import classNames from 'classnames';
import ImgPicker from './img-picker/';
import TopicPicker from './topic-picker/';
import EmojPicker from './emoj-picker/';

export default class ResPicker extends React.Component {
  constructor() {
    super();

    this.state = {
      menus: [{
        id: 'topic',
        text: '话题'
      }, {
        id: 'emoj',
        text: '表情'
      }, {
        id: 'photo',
        text: '图片'
      }]
    };
  }

  switchMenu(menu: Object, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      on: menu.id
    });
  }

  pickTopic(topic: Object) {
    this.setState({
      topic: topic
    });
  }

  pickEmoj(emoj: Object) {
    this.setState({
      emoj: emoj
    })
  }

  pick() {}

  render() {
    let picker;

    switch (this.state.on) {
      case 'topic':
        picker = <TopicPicker onPick={this.pickTopic.bind(this)} />
        break;
      case 'emoj':
        picker = <EmojPicker onPick={this.pickEmoj.bind(this)} />
        break;
      case 'photo':
        picker = <ImgPicker onPick={this.pick.bind(this)} />
        break;
    }

    let menuList = this.state.menus.map((menu, index) => {
      return (
        <li
          key={'picker-menu_' + index}
          onClick={this.switchMenu.bind(this, menu)}
          className={classNames(this.state.on === menu.id ? 'on': '')}>
          <a href="#">{menu.text}</a>
        </li>
      )
    })

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
        <div className="res-menus-wrapper">
          <ul className="res-menus">
            {menuList}
          </ul>
        </div>
        <section className="res-picker-panel">
          {picker}
        </section>
      </div>
    )
  }
}
