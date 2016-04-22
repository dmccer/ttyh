import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import './list.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import Loading from '../../loading/';
import Poptip from '../../poptip/';
import ReadableTime from '../readable-time/';
import Avatar from '../avatar/';

import AH from '../../helper/ajax';
import {
  HotUser,
  FollowUser
} from '../model/';

export default class ActiveUserList extends React.Component {
  state = {
    users: [],
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.ah.one(HotUser, {
      success: (data) => {
        this.setState({
          users: data.bbsUserDoSortDTOList
        });
      },
      error: () => {
        this.refs.poptip.warn('加载活跃用户失败');
      }
    });
  }

  follow(user) {
    this.ah.one(FollowUser, {
      success: (data) => {
        if (data.errMsg) {
          this.refs.poptip.success(data.errMsg);

          return;
        }

        this.refs.poptip.success('关注成功');

        user.follow = 1;
        this.forceUpdate();
      },
      error: (xhr) => {
        this.refs.poptip.warn('关注失败');
      }
    }, user.uid);
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
                <span>一周内: 发帖 <b>{user.fcount}</b></span>
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

ReactDOM.render(<ActiveUserList />, document.querySelector('.page'));
