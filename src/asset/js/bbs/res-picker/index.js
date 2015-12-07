import '../../../less/global/layout.less';
import './index.less';

import React from 'react';
import classNames from 'classnames';
import ImgPicker from './img-picker/';
import TopicPicker from './topic-picker/';
import EmojPicker from './emoj-picker/';

export default class ResPicker extends React.Component {
  static menus(): Array<Object> {
    return [{
      id: 'topic',
      text: '话题'
    }, {
      id: 'emoj',
      text: '表情'
    }, {
      id: 'photo',
      text: '图片'
    }];
  }

  constructor() {
    super();

    this.state = {
      menus: []
    };
  }

  componentDidMount() {
    let customMenus = this.props.menus || [];

    let menus = ResPicker.menus().filter((menu) => {
      return customMenus.indexOf(menu.id) !== -1;
    });

    this.setState({
      menus: menus
    })
  }

  switchMenu(menu: Object, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (menu.id === this.state.on) {
      this.setState({
        on: null
      });
      return;
    }

    this.setState({
      on: menu.id
    });
  }

  pickTopic(topic: Object) {
    this.props.onPick({
      topic: topic
    });
  }

  pickEmoj(emoj: Object) {
    this.props.onPick({
      emoj: emoj
    });
  }

  handleImgsChange(photo: Array<Object>) {
    this.props.onPick({
      photo: photo
    });
  }

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
        picker = <ImgPicker onImgsChange={this.handleImgsChange.bind(this)} />
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
