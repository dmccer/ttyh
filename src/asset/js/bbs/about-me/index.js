import '../../../less/global/global.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import AboutMeHeadBar from './head-bar/';
import Post from '../post/';
import ReplyList from './reply/';
import LoadMore from '../../load-more/';
import Loading from  '../../loading/';
import Poptip from  '../../poptip/';

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
      }],
      f: 0,
      t: 30,
      count: 0
    }
  }

  componentDidMount() {
    this.query(this.state.tab);

    LoadMore.init(() => {
      this.query(this.state.tab);
    });
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
      url: '/api/bbs/has_remind',
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
    let f = this.state.f;

    if (this.state.last === 'forum') {
      f += this.state.count;
    } else {
      f = 0;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_my_forum',
      type: 'GET',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: this.state.t,
        f: f
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.format(data.bbsForumList);

          this.setState({
            posts: f > 0 ? this.state.posts.concat(data.bbsForumList) : data.bbsForumList,
            f: f,
            count: data.bbsForumList.length,
            last: 'forum'
          });
        } else {
          this.refs.poptip.info('没有更多了');
        }

        this.refs.loading.close();
      },
      error: () => {
        this.refs.loading.close();
      }
    });
  }

  queryMyReplies() {
    let f = this.state.f;

    if (this.state.last === 'comment') {
      f += this.state.count;
    } else {
      f = 0;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_my_commend',
      type: 'GET',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: this.state.t,
        f: f
      },
      success: (data) => {
        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.format(data.bbsForumList);

          this.setState({
            replies: f > 0 ? this.state.replies.concat(data.bbsForumList) : data.bbsForumList,
            f: f,
            count: data.bbsForumList.length,
            last: 'comment'
          });
        } else {
          this.refs.poptip.info('没有更多了');
        }

        this.refs.loading.close();
      },
      error: () => {
        this.refs.loading.close();
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
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    )
  }
}

ReactDOM.render(<AboutMe />, $('#page').get(0))
