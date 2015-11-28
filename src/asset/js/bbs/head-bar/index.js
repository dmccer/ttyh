import './index.less';

import React from 'react';

export default class HeadBar extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="row head-bar">
        <div className="notice">
          <i className="icon icon-bell"></i>提醒
        </div>
        <ul className="tabs grid">
          <li className="tab active">
            <a href="#">所有<i className="icon-spread"></i></a>
            <ul className="spread-list hide">
              <li>所有</li>
              <li>关注</li>
            </ul>
          </li>
          <li className="tab">
            <a href="#"><i className="icon icon-hot"></i>热门</a>
          </li>
        </ul>
        <div className="post">发帖<i className="icon icon-edit"></i></div>
      </section>
    );
  }
}
