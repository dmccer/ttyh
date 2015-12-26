import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import './list.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';
import querystring from 'querystring';

export default class ActiveUserList extends React.Component {
  constructor() {
    super();

    this.state = {
      users: [],
      qs: querystring.parse(location.search.substring(1))
    }
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/hot_user',
      type: 'GET',
      cache: false,
      data: {
        uid: this.state.qs.uid
      },
      success: (data) => {
        this.refs.loading.close();

        this.setState({
          users: data.bbsUserDoSortDTOList
        });
      },
      error: () => {
        this.refs.loading.close();
        this.refs.poptip.warn('加载活跃用户失败');
      }
    })
  }

  follow(user) {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/mvc/followForBBS_' + user.uid,
      type: 'GET',
      cache: false,
      data: {
        code: this.state.qs.code
      },
      success: (data) => {
        this.refs.loading.close();

        if (data.errMsg) {
          this.refs.poptip.success(data.errMsg);

          return;
        }

        this.refs.poptip.success('关注成功');

        user.follow = 1;
        this.forceUpdate();
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }

        this.refs.loading.close();
        this.refs.poptip.warn('关注失败');
      }
    });
  }

  render_follow(follow, user) {
    if (follow === 1) {
      return (
        <span
          className="followed">
          <i className="icon icon-correct s20"></i>
          <span><b>已关注</b></span>
        </span>
      )
    }

    return (
      <span
        className="follow"
        onClick={this.follow.bind(this, user)}>
        <i className="icon icon-plus"></i>
        <span><b>关注</b></span>
      </span>
    );
  }

  render() {
    let userList = this.state.users.map((user, index) => {
      return (
        <div className="user-item" key={'active-user_' + index}>
          <div className="user-item-inner row">
            <div className="col avatar-col">
              <Avatar uid={user.uid} url={user.imgUrl} name={user.userName} size="s50" />
            </div>
            <div className="col profile">
              <h2>{user.userName}</h2>
              <p>
                <span>一周内: 发帖 <b>{user.pcount}</b></span>
                <span>评论 <b>{user.rcount}</b></span>
              </p>
              <ReadableTime time={user.last_do_time} />
            </div>
            <div className="col actions">
              {this.render_follow(user.follow, user)}
            </div>
          </div>
        </div>
      );
    });

    return (
      <section className="active-user-list">
        <div className="user-list">
          {userList}
        </div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<ActiveUserList />, $('#page').get(0));
