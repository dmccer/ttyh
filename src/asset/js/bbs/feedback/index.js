import './index.less';

import React from 'react';
import classNames from 'classnames';
import CommentList from './comment/';
import PraiseList from './praise/';
import ActionBar from './action-bar/';
import querystring from 'querystring';
import Loading from '../../loading/';
import Poptip from '../../poptip/';

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
      qs: query
    }
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
    $.ajax({
      url: '/mvc/bbs_v2/show_commend',
      type: 'GET',
      data: {
        id: this.props.fid,
        t: 20
      },
      success: (data) => {
        this.setState({
          comments: data.bbsForumList
        })
      }
    })
  }

  queryPraiseList() {
    $.ajax({
      url: '/mvc/bbs_v2/show_praise',
      type: 'GET',
      data: {
        id: this.props.fid,
        t: 20
      },
      success: (data) => {
        this.setState({
          praises: data.bbsPraiseList
        })
      }
    })
  }

  comment(forum) {
    const url = '/bbs-comment.html?' + querystring.stringify({
      fid: forum.id,
      tid: forum.tid,
      uid: this.state.qs.uid,
      token: this.state.qs.token
    });

    location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, url);
  }

  praise(forum: Object) {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/mvc/bbs_v2/praise',
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
        if (forum.id !== this.state.qs.fid) {
          this.queryCommentList();
          return;
        }

        // 当前帖子点赞
        this.queryPraiseList();
      }
    });
  }

  renderTab() {
    switch(this.state.tab) {
      case 'comment':
        return (
          <CommentList
            items={this.state.comments}
            onPraise={this.praise.bind(this)}
            onComment={this.comment.bind(this)} />
        );
      case 'praise':
        return <PraiseList items={this.state.praises} />;
    }
  }

  render() {
    return (
      <section className="feedback">
        <ul className="feedback-type-tabs">
          <li
            className={this.state.tab === 'comment' ? 'on' : ''}
            onClick={this.switchTab.bind(this, 'comment')}>
            <a href="#">评论</a>
          </li>
          <li
            className={this.state.tab === 'praise' ? 'on' : ''}
            onClick={this.switchTab.bind(this, 'praise')}>
            <a href="#">赞</a>
          </li>
        </ul>
        {this.renderTab()}
        <div className="action-bar-holder"></div>
        <ActionBar
          forum={{
            id: this.props.fid,
            tid: this.props.tid
          }}
          onPraise={this.praise.bind(this)}
          onComment={this.comment.bind(this)}
        />
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    )
  }
}
