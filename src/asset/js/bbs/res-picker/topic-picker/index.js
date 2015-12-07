import './index.less';

import React from 'react';

export default class TopicPicker extends React.Component {
  constructor() {
    super();

    this.state = {
      topics: [
        {
          id: 'jyfx',
          text: '经验分享'
        }, {
          id: 'sslk',
          text: '实时路况'
        }, {
          id: 'qsyk',
          text: '轻松一刻'
        }, {
          id: 'wxwx',
          text: '我型我秀'
        }
      ]
    };
  }

  pick(topic: Object, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPick(topic);
  }

  render() {
    let topicList = this.state.topics.map((topic, index) => {
      return (
        <a
          href="#"
          key={'topic-item_' + index}
          onClick={this.pick.bind(this, topic)}>{topic.text}</a>
      )
    });

    return (
      <div className="topic-list">
        {topicList}
      </div>
    )
  }
}
