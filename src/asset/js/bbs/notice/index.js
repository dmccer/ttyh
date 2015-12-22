import '../../../less/global/global.less';
import '../post/item.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import Emoj from '../emoj/';
import querystring from 'querystring';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';

export default class NoticeDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
      imgs: []
    };
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs/all_public',
      type: 'GET',
      success: (data) => {
        let notice = data.bbsForumList[0];
        notice.load = true;

        this.setState(notice);

        this.refs.loading.close();
      },
      error: () => {
        this.refs.loading.close();
      }
    });
  }

  _render() {
    if (!this.state.load) {
      return;
    }

    let imgs = this.state.imgs.map((img, index) => {
      return <a href="javascript:void(0)" key={'img-item_' + index}><img src={img} /></a>
    });

    let topicPostUrl = './topic-posts.html?' + querystring.stringify($.extend({}, this.state.qs, {
      tid: this.state.tid
    }));

    return (
      <section className="post-item">
        <header className="row">
          <div className="profile">
            <Avatar uid={this.state.uid} url={require('../../../img/2x/ttxm@2x.png')} size="s40" />
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
              <a href={topicPostUrl}><b>#{this.state.topic}#</b></a>
              {Emoj.formatText(this.state.content)}
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

ReactDOM.render(<NoticeDetail />, $('#page').get(0));
