import './index.less';
import '../../../less/component/tab.less';

import React from 'react';
import classNames from 'classnames';

export default class HeadBar extends React.Component {
  constructor() {
    super();

    this.state = {
      tabVals: ['all', 'focus', 'hot']
    };
  }

  componentDidMount() {

  }

  switchTab(tab: string) {
    this.props.onSwitch(tab);
  }

  render() {
    return (
      <section className="row head-bar">
        <div className="notice">
          <i className="icon icon-bell"></i>提醒
        </div>
        <ul className="tabs grid">
          <li value={this.state.tabVals[0]} className={classNames('tab', ['all', 'focus'].indexOf(this.props.on) !== -1 ? 'active' : '')} onClick={this.switchTab.bind(this, 'all')}>
            <a href="#">所有<i className="icon-spread"></i></a>
            <ul className="spread-list hide">
              <li>所有</li>
              <li>关注</li>
            </ul>
          </li>
          <li value={this.state.tabVals[2]} className={classNames('tab', this.props.on === 'hot' ? 'active' : '')} onClick={this.switchTab.bind(this, 'hot')}>
            <a href="#"><i className="icon icon-hot"></i>热门</a>
          </li>
        </ul>
        <div className="post">发帖<i className="icon icon-edit"></i></div>
      </section>
    );
  }
}
