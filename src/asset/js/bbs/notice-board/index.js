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
        });

        this.scroll();
      }
    });
  }

  scroll() {
    let $content = $(this.refs.content);
    let $text = $(this.refs.text);

    let len = $text.width();
    let w = $content.width();

    let delta = len - w;

    let fn = () => {
      $text.animate({
        left: -delta
      }, this.state.text.length / 3 * 1000, 'linear', () => {
        $text.css({
          left: 0
        });

        setTimeout(fn, 2000);
      });
    }

    fn();
  }

  render() {
    return (
      <section className="notice-board">
        <div className="nb-tag">
          <i className="tag purple">公告</i>
        </div>
        <div className="nb-time"><ReadableTime time={this.state.time} /></div>
        <div className="nb-content" ref="content"><p className="nb-text" ref="text">{this.state.text}</p></div>
      </section>
    );
  }
}
