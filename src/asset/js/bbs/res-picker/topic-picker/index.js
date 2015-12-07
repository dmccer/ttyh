import './index.less';

import React from 'react';

export default class TopicPicker extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="topic-list">
        <a href="#">经验分享</a>
        <a href="#">实时路况</a>
        <a href="#">轻松一刻</a>
        <a href="#">我型我秀</a>
      </div>
    )
  }
}
