import './index.less';

import React from 'react';
import ReadableTime from '../readable-time/';
import Emoj from '../emoj/';
import AH from '../../helper/ajax';
import {
  AllPublishedNotice
} from '../model/';

export default class NoticeBoard extends React.Component {
  constructor() {
    super()

    this.state = {
      text: null,
      time: null
    }
  }

  componentDidMount() {
    this.ah = new AH();

    this.ah.one(AllPublishedNotice, (data) => {
      let notice = data.bbsForumList[0];
      this.setState({
        time: notice.create_time,
        text: notice.content,
        id: notice.id
      });

      this.scroll();
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
    let url = './notice.html?id=' + this.state.id;
    return (
      <section className="notice-board">
        <div className="nb-tag">
          <i className="tag purple">公告</i>
        </div>
        <div className="nb-time"><ReadableTime time={this.state.time} /></div>
        <div className="nb-content" ref="content"><p className="nb-text" ref="text"><a href={url}>{Emoj.formatText(this.state.text)}</a></p></div>
      </section>
    );
  }
}
