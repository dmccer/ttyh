import './index.less';
import '../../../less/component/icon.less';
import '../../../less/component/tab.less';

import React from 'react';
import classNames from 'classnames';

export default class HeadBar extends React.Component {
  constructor() {
    super();

    this.state = {
      showSpreadList: false,
      tabVals: ['all', 'focus', 'hot'],
      tabItems: [
        {
          key: 'all',
          text: '所有'
        }, {
          key: 'focus',
          text: '关注'
        }
      ],
      selectedTabItem: {}
    };
  }

  componentDidMount() {
    this.setState({
      selectedTabItem: this.state.tabItems[0]
    });
  }

  switchTab(tab: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.on === tab) {
      return;
    }

    this.props.onSwitch(tab);
  }

  selectSpreadItem(tabItem: Object, e: Object) {
    this.props.onSwitch(tabItem.key);

    this.setState({
      selectedTabItem: tabItem
    });

    this.toggleSpread(e);
  }

  toggleSpread(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showSpreadList: !this.state.showSpreadList
    });
  }

  render() {
    const isAllTabActive = ['all', 'focus'].indexOf(this.props.on) !== -1;

    return (
      <section className="row head-bar">
        <div className="notice">
          <i className="icon icon-bell"></i>提醒
        </div>
        <ul className="tabs grid">
          <li
            value={this.state.tabVals[0]}
            className={classNames('tab', isAllTabActive ? 'active' : '')}
            onClick={this.switchTab.bind(this, this.state.selectedTabItem.key)}>
            <a href="#" className="tab-text">
              <span>{this.state.selectedTabItem.text}</span>
              <i
                className={classNames('icon', 'icon-spread', isAllTabActive ? 'white' : 'teal')}
                onClick={this.toggleSpread.bind(this)}></i>
            </a>
            <ul className={classNames('spread-list', this.state.showSpreadList ? '' : 'hide')}>
              {
                this.state.tabItems.map((item, index) => {
                  return <li
                    key={'tab-item_' + index}
                    onClick={this.selectSpreadItem.bind(this, item)}>{item.text}</li>
                })
              }
            </ul>
          </li>
          <li value={this.state.tabVals[2]} className={classNames('tab', this.props.on === 'hot' ? 'active' : '')} onClick={this.switchTab.bind(this, 'hot')}>
            <a href="#" className="tab-text">
              <span>热门</span>
              <i className="icon icon-hot"></i>
            </a>
          </li>
        </ul>
        <div className="post"><a href="./bbs-post.html">发帖<i className="icon icon-edit"></i></a></div>
      </section>
    );
  }
}
