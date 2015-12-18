import './index.less';

import React from 'react';

export default class Topic extends React.Component {
  constructor() {
    super();

    this.state = {
      topics: []
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/mvc/bbs/all_topic',
      type: 'GET',
      success: (data) => {
        this.setState({
          topics: data.bbsTopicList
        });

        this.forceUpdate();
      }
    })
  }

  render() {
    let topicList = this.state.topics.map((topic, index) => {
      return <a
        href="#"
        key={'topic-item_' + index}
        title={topic.name}
      ><i className="icon icon-topic s20 disable"></i>{topic.name}</a>
    })

    return (
      <section className="topic-list-panel">
        <h2 className="subtitle">话题</h2>
        <div className="topic-list">
          {topicList}
        </div>
      </section>
    );
  }
}
