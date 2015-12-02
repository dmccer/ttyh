import '../../../../less/global/layout.less';
import '../../../../less/component/tab.less';
import '../../../../less/component/icon.less';
import './index.less';

import React from 'react';

export default class AboutMeHeadBar extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <section className="about-me-head-bar">
        <ul className="tabs grid">
          <li className="tab active">
            <a href="#">我的发帖<i className="icon icon-dot"></i></a>
          </li>
          <li className="tab">
            <a href="#">我的回复<i className="icon icon-dot"></i></a>
          </li>
        </ul>
      </section>
    )
  }
}
