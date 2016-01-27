import './index.less';
import React from 'react';

function calcTime(time) {
  if (!time) {
    return;
  }

  let now = new Date();
  let delta = now.getTime() - time;

  if (delta / 1000 < 10) {
    return '刚刚';
  }

  if (delta / 1000 < 60) {
    return Math.round((delta % 60000) / 1000) + '秒前';
  }

  if (delta / 60000 < 60 && delta / 60000 > 0) {
    return Math.round((delta % 3600000) / 60000) + '分钟前';
  }

  if (delta / 3600000 < 24 && delta / 3600000 >= 0) {
    return Math.round(delta / 3600000) + '小时前';
  }

  let date = new Date(time);

  let m = date.getMonth() + 1;
  if (m < 10) {
    m = '0' + m;
  }

  let d = date.getDate();
  if (d < 10) {
    d = '0' + d;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return `${m}-${d}`;
  }

  return `${date.getFullYear()}-${m}-${d}`;
}

export default class ReadableTime extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="readable-time">
        <i className="icon icon-clock s12"></i>
        <span>{calcTime(this.props.time)}</span>
      </div>
    )
  }
}

export class MiniReadableTime extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <span className="readable-time">{calcTime(this.props.time)}</span>
    )
  }
}
