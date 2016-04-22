import '../../../less/global/global.less';
import '../post/item.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import assign from 'lodash/object/assign';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';
import AH from '../../helper/ajax';
import $ from '../../helper/z';
import {
  AllPublishedNotice
} from '../model/';

export default class NoticeDetail extends React.Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    imgs: []
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.ah.one(AllPublishedNotice, (data) => {
      let notice = data.bbsForumList[0];
      notice.load = true;

      this.setState(notice);

      this.refs.loading.close();
    });
  }

  _render() {
    if (!this.state.load) {
      return;
    }

    let imgs = this.state.imgs.map((img, index) => {
      return <a href="javascript:void(0)" key={'img-item_' + index}><img src={img} /></a>
    });

    let topicPostUrl = './topic-posts.html?' + querystring.stringify(assign({}, this.state.qs, {
      tid: this.state.tid,
      topic: this.state.topic
    }));

    let topic = $.trim(this.state.topic) !== '' ? <b>{`#${this.state.topic}#`}</b> : '';

    return (
      <section className="post-item">
        <header className="row">
          <div className="profile">
            <Avatar uid={this.state.uid} name={this.state.userName} url={this.state.imgUrl} size="s40" />
            <div className="poster">{this.state.userName}<i className="flag">官方</i></div>
            <ReadableTime time={this.state.create_time} />
          </div>
        </header>
        <article className="post-body">
          <div className="post-title">
            <h2>{this.state.title}</h2>
          </div>
          <section className="post-content">
            <p className="post-text">
              <a href={topicPostUrl}>{topic}</a>
              {Emoj.formatText(this.state.content, true)}
            </p>
            <div className="photo">
              {imgs}
            </div>
          </section>
          <div className="address">
          </div>
        </article>
      </section>
    )
  }

  render() {
    return (
      <section className="post-detail">
        {this._render()}
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    );
  }
}

ReactDOM.render(<NoticeDetail />, document.querySelector('.page'));
