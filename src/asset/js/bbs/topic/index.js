import './index.less';

import React from 'react';
import querystring from 'querystring';

export default class Topic extends React.Component {
  constructor() {
    super();

    this.state = {
      topics: [],
      qs: querystring.parse(location.search.substring(1))
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/api/bbs_v2/all_topic',
      type: 'GET',
      cache: false,
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
      let url = './topic-posts.html?' + querystring.stringify($.extend({}, this.state.qs, { tid: topic.id, topic: topic.name }));

      return <a
        href={url}
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
