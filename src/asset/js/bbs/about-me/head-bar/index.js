import '../../../../less/global/layout.less';
import '../../../../less/component/tab.less';
import '../../../../less/component/icon.less';
import './index.less';

import React from 'react';
import classNames from 'classnames';

export default class AboutMeHeadBar extends React.Component {
  constructor() {
    super();
  }

  switchTab(tab: Object, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (tab.key === this.props.on) {
      return;
    }

    this.props.onSwitch(tab.key);
  }

  render() {
    let tabList = this.props.tabs.map((tab, index) => {
      return (
        <li
          key={'about-me-tab_' + index}
          className={classNames('tab', this.props.on === tab.key ? 'active' : '')}
          onClick={this.switchTab.bind(this, tab)}
        >
          <a href="#">
            {tab.text}
            <i className={classNames('icon', tab.has ? 'icon-dot' : '')}></i>
          </a>
        </li>
      )
    });
    return (
      <section className="about-me-head-bar">
        <ul className="tabs grid">
          {tabList}
        </ul>
      </section>
    )
  }
}
