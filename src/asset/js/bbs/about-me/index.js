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
import GoTop from '../../gotop/';
import JWeiXin from '../../jweixin/';

const DEL_REPLY_ERR = {
  1: 'uid 有误',
  2: 'fid 有误',
  3: '帖子不存在',
  4: '禁止非本人操作'
}

export default class AboutMe extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      qs: query,
      tab: query.tab || 'forum', // all, focus, hot
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
    };

    new JWeiXin(() => {
      this.setState({
        wx_ready: true
      });
    });
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
      cache: false,
      data: {
        uid: this.state.qs.uid
      },
      success: (data) => {
        this.state.tabs.forEach((tab) => {
          tab.has = data[tab.key + '_count'] !== 0;
        });
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }
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
      cache: false,
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: this.state.t,
        f: f
      },
      success: (data) => {
        this.refs.loading.close();

        if (data && data.bbsForumList && data.bbsForumList.length) {
          console.log(data.bbsForumList);
          this.format(data.bbsForumList);

          this.setState({
            posts: f > 0 ? this.state.posts.concat(data.bbsForumList) : data.bbsForumList,
            f: f,
            count: data.bbsForumList.length,
            last: 'forum'
          });

          return;
        }

        if (this.state.posts.length) {
          this.refs.poptip.info('没有更多了');
        }
      },
      error: (xhr) => {
        this.refs.loading.close();

        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }
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
      cache: false,
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        t: this.state.t,
        f: f
      },
      success: (data) => {
        this.refs.loading.close();

        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.format(data.bbsForumList);

          this.setState({
            replies: f > 0 ? this.state.replies.concat(data.bbsForumList) : data.bbsForumList,
            f: f,
            count: data.bbsForumList.length,
            last: 'comment'
          });

          return;
        }

        if (this.state.replies.length) {
          this.refs.poptip.info('没有更多了');
        }
      },
      error: (xhr) => {
        this.refs.loading.close();

        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }
      }
    })
  }

  removeReply(reply: Object) {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/api/bbs_v2/_del',
      type: 'POST',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        fid: reply.id
      },
      success: (code) => {
        this.refs.loading.close();

        if (code == 0) {
          this.refs.poptip.success('删除成功');

          this.setState({
            f: 0,
            count: 0
          });

          this.queryMyReplies();

          return;
        }

        this.refs.poptip.warn(DEL_REPLY_ERR[code] || '删除失败');
      },
      error: (xhr) => {
        this.refs.loading.close();

        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }
      }
    });
  }

  switchTab(tab: string) {
    this.setState({
      tab: tab
    });

    let qs = querystring.stringify($.extend({}, this.state.qs, { tab: tab }));
    location.replace(location.protocol + '//' + location.host + location.pathname + '?' + qs);

    // this.query(tab);
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
                return <Post items={this.state.posts} remind={true} wx_ready={this.state.wx_ready} />;
              case 'comment':
                return <ReplyList items={this.state.replies} remove={this.removeReply.bind(this)} />;
            }
          })()
        }
        <GoTop />
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    )
  }
}

ReactDOM.render(<AboutMe />, $('#page').get(0))
