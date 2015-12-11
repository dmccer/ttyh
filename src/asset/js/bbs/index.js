import '../../less/page/bbs.less';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import HeadBar from './head-bar/';
import NoticeBoard from './notice-board/';
import Post from './post/';
import HotPost from './post/hot';
import Topic from './topic/';
import ActiveUser from './active-user/';
import Loading from  '../loading/';
import Poptip from  '../poptip/';

export default class BBS extends React.Component {
  constructor() {
    super();

    this.state = {
      tab: 'all', // all, focus, hot
      posts: []
    };
  }

  componentDidMount() {
    this.query(this.state.tab);
  }

  query(q) {
    let url;

    switch(q) {
      case 'all':
        url = '/mvc/bbs/show_all';
        break;
      case 'focus':
        return this.queryFocusForum();
      case 'hot':
        url = '/mvc/bbs/hot_forum';
        break;
    }

    this.refs.loading.show('加载中...');

    $.ajax({
      url: url,
      type: 'GET',
      data: {
        t: 20
      },
      success: (data) => {
        this.formatForums(data.bbsForumList)

        let uids = data.bbsForumList.map((item) => {
          return item.uid;
        });

        this.queryUserInfo(uids, (users) => {
          data.bbsForumList.forEach((forum) => {
            let user = users.find((user) => {
              return user.userWithLatLng.userID === forum.uid;
            });

            forum.user = {
              name: user.userWithLatLng.userName,
              avatar: user.userWithLatLng.faceImgUrl
            };
          });

          this.setState({
            posts: list
          });

          this.refs.loading.close();
        });
      },
      error: () => {
        this.refs.loading.close();
      }
    });
  }

  formatForums(list: Array<Object>) {
    list.forEach((item) => {
      item.imgs = item.imgs_url ? item.imgs_url.split(';') : [];
    });
  }

  queryFocusedUsers(cb) {
    $.ajax({
      url: '/mvc/mineFellowUserForRc',
      type: 'GET',
      data: {
        pageSize: 1000
      },
      success: (users) => {
        let uids = users.map((user) => {
          return user.userID;
        });

        cb(uids);
      },
      error: () => {

      }
    })
  }

  queryFocusForum() {
    this.queryFocusedUsers((uids) => {
      $.ajax({
        url: '/mvc/bbs/show_more_forum',
        type: 'GET',
        data: {
          userIDs: uids.join()
        },
        success: (data) => {
          this.formatForums(data.bbsForumList);
          this.queryUserInfo(data.bbsForumList);
        }
      });
    })

  }

  queryUserInfo(uids: Array<Number>, cb: Function) {
    $.ajax({
      url: '/mvc/searchUsersEncrypt',
      type: 'GET',
      data: {
        userIDs: uids.join()
      },
      success: cb,
      error: () => {
        this.refs.poptip.error('获取用户头像失败');
        this.refs.loading.close();
      }
    });
  }

  switchTab(tab: string) {
    this.setState({
      tab: tab
    });

    this.query(tab);
  }

  render() {
    return (
      <div className="bbs page">
        <HeadBar on={this.state.tab} onSwitch={this.switchTab.bind(this)}/>
        {
          (() => {
            switch (this.state.tab) {
              case 'all':
              case 'focus':
                return (
                  <div className="tab-all">
                    <NoticeBoard />
                    <Post items={this.state.posts} />
                  </div>
                )
              case 'hot':
                return (
                  <div className="tab-hot">
                    <Topic />
                    <ActiveUser />
                    <HotPost items={this.state.posts} />
                  </div>
                )
            }
          })()
        }
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </div>
    );
  }
}

ReactDOM.render(<BBS />, $('#page').get(0));
