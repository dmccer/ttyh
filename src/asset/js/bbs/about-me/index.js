import '../../../less/global/global.less';

import React from 'react';
import ReactDOM from 'react-dom';

import AboutMeHeadBar from './head-bar/';
import Post from '../post/';
import ReplyList from './reply/';
import querystring from 'querystring';

export default class AboutMe extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
      tab: 'forum', // post, reply
      posts: [],
      replies: [],
      tabs: [{
        key: 'forum',
        text: '我的发帖'
      }, {
        key: 'comment',
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
      case 'forum':
        return this.queryMyPosts();
      case 'comment':
        return this.queryMyReplies();
    }
  }

  checkHasNewPostsOrReplies() {
    $.ajax({
      url: '/mvc/bbs/has_remind',
      type: 'GET',
      data: {
        uid: this.state.qs.uid
      },
      success: (data) => {
        this.state.tabs.forEach((tab) => {
          tab.has = data[tab.key + '_count'] !== 0;
        });
      }
    });
  }

  format(list: Object) {
    list.forEach((item) => {
      item.imgs = item.imgs_url && item.imgs_url.split(';') || [];
    });
  }

  queryMyPosts() {
    $.ajax({
      url: '/mvc/bbs_v2/show_my_forum',
      type: 'GET',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: 20
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.format(data.bbsForumList);

          this.setState({
            posts: data.bbsForumList
          });
        }
      }
    });
  }

  queryMyReplies() {
    $.ajax({
      url: '/mvc/bbs_v2/show_my_commend',
      type: 'GET',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: 20
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.format(data.bbsForumList);

          this.setState({
            replies: data.bbsForumList
          });
        }
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
              case 'forum':
                return <Post items={this.state.posts} />;
              case 'comment':
                return <ReplyList items={this.state.replies} />;
            }
          })()
        }
      </section>
    )
  }
}

ReactDOM.render(<AboutMe />, $('#page').get(0))
