import './index.less';

import React from 'react';
import querystring from 'querystring';
import AH from '../../helper/ajax';
import {
  Topics
} from '../model/';

export default class Topic extends React.Component {
  constructor() {
    super();

    this.state = {
      topics: [],
      qs: querystring.parse(location.search.substring(1))
    }
  }

  componentDidMount() {
    this.ah = new AH();

    this.ah.one(Topics, (data) => {
      this.setState({
        topics: data.bbsTopicList
      });

      this.forceUpdate();
    });
  }

  render() {
    let topics = [];

    this.state.topics.forEach((item) => {
      if (item.id != 1) {
        topics.push(item);
      }
    });

    let topicList = topics.map((topic, index) => {
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
