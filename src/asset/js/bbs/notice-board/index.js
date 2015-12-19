import './index.less';

import React from 'react';
import ReadableTime from '../readable-time/';

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
      url: '/api/bbs/all_public',
      type: 'GET',
      success: (data) => {
        this.setState({
          time: data.bbsForumList[0].create_time,
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
        <div className="nb-time"><ReadableTime time={this.state.time} /></div>
        <div className="nb-content"><p>{this.state.text}</p></div>
      </section>
    );
  }
}
