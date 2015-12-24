import './index.less';
import '../../../less/component/icon.less';
import '../../../less/component/tab.less';

import React from 'react';
import classNames from 'classnames';
import querystring from 'querystring';

export default class HeadBar extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
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
    this.checkHasNewPostsOrReplies();

    this.setState({
      selectedTabItem: this.state.tabItems[0]
    });
  }

  switchTab(tab: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.on === tab) {
      if (tab !== 'hot') {
        this.toggleSpread(e);
      }

      return;
    }

    this.props.onSwitch(tab);
    this.close();
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

  close() {
    this.setState({
      showSpreadList: false
    });
  }

  checkHasNewPostsOrReplies() {
    let fn = () => {
      $.ajax({
        url: '/api/bbs/has_remind',
        type: 'GET',
        cache: false,
        data: {
          uid: this.state.qs.uid
        },
        success: (data) => {
          this.setState({
            notice: data.comment_count !== 0
          });
        }
      });

      setTimeout(fn, 60*1000);
    }

    fn();
  }

  render() {
    const isAllTabActive = ['all', 'focus'].indexOf(this.props.on) !== -1;
    const aboutMeUrl = './bbs-about-me.jsp?' + querystring.stringify(this.state.qs);
    const postUrl = './bbs-post.jsp?' + querystring.stringify(this.state.qs);

    return (
      <section className="row head-bar">
        <div className="notice">
          <a href={aboutMeUrl}>
            <i className="icon icon-bell s20 on"></i>
            <span>提醒</span>
            {
              (() => {
                if (this.state.notice) {
                  return <i className="icon icon-dot"></i>;
                }
              })()
            }
          </a>
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
                    onClick={this.selectSpreadItem.bind(this, item)}>{item.text}<i className={classNames('icon s20', (this.props.on === item.key) && 'icon-right' || '')}></i></li>
                })
              }
            </ul>
          </li>
          <li value={this.state.tabVals[2]} className={classNames('tab', this.props.on === 'hot' ? 'active' : '')} onClick={this.switchTab.bind(this, 'hot')}>
            <a href="#" className="tab-text">
              <i className={classNames('icon icon-hot s20', this.props.on === 'hot' ? 'off' : 'on')}></i>
              <span>热门</span>
            </a>
          </li>
        </ul>
        <div className="post"><a href={postUrl}><span>发帖</span><i className="icon icon-edit s20 on"></i></a></div>
      </section>
    );
  }
}
