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
    }
  }

  switchTab(tab: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      tab: tab
    });
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
                return <CommentList postId={this.props.postId}/>;
              case 'praise':
                return <PraiseList postId={this.props.postId} />;
              default:
                return <CommentList postId={this.props.postId} />
            }
          })()
        }
        <ActionBar />
      </section>
    )
  }
}
