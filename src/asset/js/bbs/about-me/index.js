import React from 'react';
import ReactDOM from 'react-dom';

import AboutMeHeadBar from './head-bar/';
import Post from '../post/';
import ReplyList from './reply/';

export default class AboutMe extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: 'post', // post, reply
      posts: [],
      replies: [],
      tabs: [{
        key: 'post',
        text: '我的发帖'
      }, {
        key: 'reply',
        text: '我的回复'
      }]
    }
  }

  componentDidMount() {
    this.query(this.state.tab);
  }

  query(tab: string) {
    this.checkHasNewPostsOrReplies();

    switch (tab) {
      case 'post':
        return this.queryMyPosts();
      case 'reply':
        return this.queryMyReplies();
    }
  }

  checkHasNewPostsOrReplies() {
    $.ajax({
      url: '/notice/aboutme',
      type: 'GET',
      success: (data) => {
        this.state.tabs.forEach((tab) => {
          tab.has = data[tab.key];
        });
      }
    })
  }

  queryMyPosts() {
    $.ajax({
      url: '/posts/my',
      type: 'GET',
      success: (data) => {
        this.setState({
          posts: data.list
        });
      }
    });
  }

  queryMyReplies() {
    $.ajax({
      url: '/posts/replies/my',
      type: 'GET',
      success: (data) => {
        this.setState({
          replies: data.list
        });
      }
    })
  }

  switchTab(tab: string) {
    this.setState({
      tab: tab
    });

    this.query(tab);
  }

  render() {
    return (
      <section className="about-me">
        <AboutMeHeadBar
          on={this.state.tab}
          onSwitch={this.switchTab.bind(this)}
          tabs={this.state.tabs}
        />
        {
          (() => {
            switch (this.state.tab) {
              case 'post':
                return <Post items={this.state.posts} />;
              case 'reply':
                return <ReplyList items={this.state.replies} />;
            }
          })()
        }
      </section>
    )
  }
}

ReactDOM.render(<AboutMe />, $('#page').get(0))
