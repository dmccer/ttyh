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
      uid: query.uid
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
      url: '/mvc/bbs/show_commend',
      type: 'GET',
      data: {
        id: this.props.postId,
        uid: null,
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
      url: '/mvc/bbs/show_praise',
      type: 'GET',
      data: {
        id: this.props.postId,
        t: 20
      },
      success: (data) => {
        this.setState({
          praises: data.bbsPraiseList
        })
      }
    })
  }

  praise() {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/mvc/bbs/praise',
      type: 'POST',
      data: {
        uid: this.state.uid,
        fid: this.props.postId
      },
      success: (data) => {
        this.refs.loading.close();

        if (data !== 0) {
          this.refs.poptip.warn(PRAISE_ERR[data] || '点赞失败, 请重试');

          return;
        }

        this.refs.poptip.success('点赞成功');
        this.queryPraiseList();
      }
    })
  }

  render() {
    return (
      <section className="feedback">
        <ul className="feedback-type-tabs">
          <li className={this.state.tab === 'comment' ? 'on' : ''} onClick={this.switchTab.bind(this, 'comment')}><a href="#">评论</a></li>
          <li className={this.state.tab === 'praise' ? 'on' : ''} onClick={this.switchTab.bind(this, 'praise')}><a href="#">赞</a></li>
        </ul>
        {
          (() => {
            switch(this.state.tab) {
              case 'comment':
                return <CommentList items={this.state.comments} />;
              case 'praise':
                return <PraiseList items={this.state.praises} />;
            }
          })()
        }
        <div className="action-bar-holder"></div>
        <ActionBar
          postId={this.props.postId}
          tid={this.props.topicId}
          uid={this.state.uid}
          onPraise={this.praise.bind(this)}
        />
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    )
  }
}
