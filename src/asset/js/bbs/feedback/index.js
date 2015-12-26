import './index.less';

import React from 'react';
import classNames from 'classnames';
import CommentList from './comment/';
import PraiseList from './praise/';
import ActionBar from './action-bar/';
import querystring from 'querystring';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import LoadMore from '../../load-more/';
import JWeiXin from '../../jweixin/';

const PRAISE_ERR = {
  1: '参数有误',
  2: '用户ID有误',
  3: '帖子ID有误',
  5: '帖子不存在',
  7: '重复点赞',
  9: '点赞提交失败'
}

export default class Feedback extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1))

    this.state = {
      tab: 'comment', // comment, praise
      comments: [],
      praises: [],
      qs: query,
      f: 0,
      t: 30,
      count: 0
    };

    new JWeiXin(() => {
      this.setState({
        wx_ready: true
      });
    });
  }

  switchTab(tab: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      tab: tab
    });

    this.queryFeedback(tab);
  }

  componentDidMount() {
    this.queryFeedback(this.state.tab);

    LoadMore.init(() => {
      if (this.state.tab === 'comment') {
        this.queryCommentList();
      }
    });
  }

  queryFeedback(tab) {
    switch (tab) {
      case 'comment':
        return this.queryCommentList();
      case 'praise':
        return this.queryPraiseList();
    }
  }

  queryCommentList() {
    let f = this.state.f;

    if (this.state.last === 'comment') {
      f += this.state.count;
    } else {
      f = 0;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_commend',
      type: 'GET',
      cache: false,
      data: {
        id: this.state.qs.fid,
        t: this.state.t,
        f: f
      },
      success: (data) => {
        this.setState({
          load: true
        });

        this.refs.loading.close();

        if (data && data.bbsForumList && data.bbsForumList.length) {
          let list = f > 0 ? this.state.comments.concat(data.bbsForumList) : data.bbsForumList;
          this.formatForum(data.bbsForumList, list);

          this.setState({
            comments: list,
            f: f,
            count: data.bbsForumList.length,
            last: 'comment'
          });

          return;
        }

        if (this.state.comments.length) {
          this.refs.poptip.info('没有更多了');
        }
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  formatForum(list, all) {
    list.forEach((item) => {
      if (item.cid !== 0) {
        item.replied = list[item.cid - 1];
      }

      item.imgs = item.imgs_url ? item.imgs_url.split(';') : [];
    });
  }

  queryPraiseList() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_praise',
      type: 'GET',
      cache: false,
      data: {
        id: this.state.qs.fid,
        f: 0,
        t: 20
      },
      success: (data) => {
        this.refs.loading.close();

        this.setState({
          load: true
        });

        if (data && data.bbsPraiseList && data.bbsPraiseList.length) {
          this.setState({
            praises: data.bbsPraiseList
          });

          return;
        }
      },
      error: () => {
        this.refs.loading.close();
      }
    });
  }

  comment(forum, type) {
    const url = '/bbs-comment.jsp?' + querystring.stringify({
      // 被评论 id
      pid: forum.id,
      // 主贴 id
      fid: this.state.qs.fid,
      tid: forum.tid,
      uid: this.state.qs.uid,
      token: this.state.qs.token,
      commend_type: type,
      code: this.state.qs.code
    });

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, url);
  }

  praise(forum: Object) {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/api/bbs_v2/praise',
      type: 'POST',
      data: {
        fid: forum.id,
        uid: this.state.qs.uid,
        token: this.state.qs.token
      },
      success: (data) => {
        this.refs.loading.close();

        if (data !== 0) {
          this.refs.poptip.warn(PRAISE_ERR[data] || '点赞失败, 请重试');

          return;
        }

        this.refs.poptip.success('点赞成功');

        // 评论列表中点赞
        if (forum.id != this.state.qs.fid) {
          forum.ipraised = true;
          forum.pcount++;

          this.forceUpdate();
          return;
        }

        // 当前帖子点赞
        this.queryPraiseList();

        this.setState({
          praised: true
        });

        this.props.onPraise();
      },

      error: (xhr) => {
        if (xhr.status === 403) {
          let qs = querystring.stringify(this.state.qs);

          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/login.html?${qs}`);
        }

        this.refs.loading.close();
        this.refs.poptip.success('点赞失败, 请重试');
      }
    });
  }

  renderTab() {
    switch(this.state.tab) {
      case 'comment':
        return (
          <CommentList
            items={this.state.comments}
            uid={this.props.uid}
            onPraise={this.praise.bind(this)}
            onComment={this.comment.bind(this)}
            wx_ready={this.state.wx_ready} />
        );
      case 'praise':
        return <PraiseList items={this.state.praises} uid={this.props.uid} />;
    }
  }

  _render() {
    if (!this.state.load) {
      return;
    }

    let forum = this.props.forum;

    if (!forum) {
      return;
    }

    let rcount = forum.rcount ? <span className="count">{forum.rcount}</span> : null;
    let pcount = forum.pcount ? <span className="count">{forum.pcount}</span> : null;

    return (
      <section>
        <ul className="feedback-type-tabs">
          <li
            className={this.state.tab === 'comment' ? 'on' : ''}
            onClick={this.switchTab.bind(this, 'comment')}>
            <a href="#">评论 {rcount}</a>
          </li>
          <li
            className={this.state.tab === 'praise' ? 'on' : ''}
            onClick={this.switchTab.bind(this, 'praise')}>
            <a href="#">赞 {pcount}</a>
          </li>
        </ul>
        {this.renderTab()}
        <div className="action-bar-holder"></div>
        <ActionBar
          forum={{
            id: forum.id,
            tid: forum.tid
          }}
          praised={this.state.praised}
          onPraise={this.praise.bind(this)}
          onComment={this.comment.bind(this)}
        />
      </section>
    )
  }

  render() {
    return (
      <section className="feedback">
        {this._render()}
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    )
  }
}
