import './index.less';

import React from 'react';
import classNames from 'classnames';
import CommentList from './comment/';
import PraiseList from './praise/';
import ActionBar from './action-bar/';

export default class Feedback extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: 'comment', // comment, praise
      comments: [],
      praises: []
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
      url: '/posts/' + this.props.postId + '/comments',
      type: 'GET',
      success: (data) => {
        this.setState({
          comments: data.list
        })
      }
    })
  }

  queryPraiseList() {
    $.ajax({
      url: '/posts/' + this.props.postId + '/praises',
      type: 'GET',
      success: (data) => {
        this.setState({
          praises: data.list
        })
      }
    })
  }

  praise() {
    $.ajax({
      url: '/posts/' + this.props.postId + '/praise',
      type: 'POST',
      success: (data) => {
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
        <ActionBar
          postId={this.props.postId}
          onPraise={this.praise.bind(this)}
        />
      </section>
    )
  }
}
