import './index.less';

import React from 'react';

export default class NoticeBoard extends React.Component {
  constructor() {
    super()

    this.state = {
      text: null,
      time: null
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/mvc/bbs/all_public',
      type: 'GET',
      success: (data) => {
        this.setState({
          time: new Date(data.bbsForumList[0].create_time).toLocaleDateString().substring(5).replace('/', '-'),
          text: data.bbsForumList[0].content
        })
      }
    })
  }

  render() {
    return (
      <section className="notice-board">
        <div className="nb-tag">
          <i className="tag purple">公告</i>
        </div>
        <div className="nb-time"><i className="icon icon-clock"></i>{this.state.time}</div>
        <div className="nb-content"><p>{this.state.text}</p></div>
      </section>
    );
  }
}
