import './index.less';

import React from 'react';
import ReadableTime from '../readable-time/';
import Emoj from '../emoj/';
import AH from '../../helper/ajax';
import $ from '../../helper/z';
import {
  AllPublishedNotice
} from '../model/';

let rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

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
    let len = $.width(this.refs.text);
    let w = $.width(this.refs.content);

    let delta = len - w;
    let count = 0;

    let fn = () => {
      count += 1;
      $.css(this.refs.text, {
        left: -count
      });

      if (count < delta) {
        rAF(fn);
      } else {
        $.css(this.refs.text, {
          left: 0
        });

        setTimeout(() => {
          count = 0;
          rAF(fn);
        }, 2000);
      }
    };

    rAF(fn);
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
