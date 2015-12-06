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
      url: '/topics',
      type: 'GET',
      success: (data) => {
        console.log(data);
        this.setState({
          topics: data.list
        });

        this.forceUpdate();
      }
    })
  }

  handleClick(e: object) {
    e.preventDefault();

    alert('xxxx');
    // <div><a href="#">经验分享</a></div>
    // <div><a href="#">实时路况</a></div>
  }

  render() {
    let topicList = this.state.topics.map((topic, index) => {
      return <div key={'topic_' + index}><a href={'http://xxx' + topic.id} onClick={this.handleClick.bind(this)}>{topic.text}</a></div>
    })

    return (
      <section className="topic-list">
        <h2 className="subtitle">话题</h2>
        <div className="topic-group">
        {topicList}
        </div>
        <div className="topic-group">
          <div><a href="#">轻松一刻</a></div>
          <div><a href="#">我型我秀</a></div>
        </div>
      </section>
    );
  }
}
