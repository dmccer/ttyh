import './index.less';

import React from 'react';

export default class NoticeBoard extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="notice-board">
        <div className="nb-tag">
          <i className="tag purple">公告</i>
        </div>
        <div className="nb-time"><i className="icon icon-clock"></i>05-15</div>
        <div className="nb-content"><p>公告内容可能会很长真的，不信你试试，这里是公告内容~~~</p></div>
      </section>
    );
  }
}
