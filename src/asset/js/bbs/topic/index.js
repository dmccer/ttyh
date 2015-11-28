import './index.less';

import React from 'react';

export default class Topic extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="topic-list">
        <h2 className="subtitle">话题</h2>
        <div className="topic-group">
          <div><a href="#">经验分享</a></div>
          <div><a href="#">实时路况</a></div>
        </div>
        <div className="topic-group">
          <div><a href="#">轻松一刻</a></div>
          <div><a href="#">我型我秀</a></div>
        </div>
      </section>
    );
  }
}
