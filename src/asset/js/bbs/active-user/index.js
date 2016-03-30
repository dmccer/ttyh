import './index.less';

import React from 'react';
import querystring from 'querystring';

import Poptip from '../../poptip/';
import Avatar from '../avatar/';
import AH from '../../helper/ajax';
import {
  HotUser
} from '../model/';


export default class Post extends React.Component {
  state = {
    users: [],
    qs: querystring.parse(location.search.substring(1))
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.ah = new AH();

    this.ah.one(HotUser, {
      success: (data) => {
        this.setState({
          users: data.bbsUserDoSortDTOList
        });
      },
      error: () => {
        this.refs.poptip.warn('加载人气用户失败');
      }
    }, this.state.qs.uid);
  }

  render() {
    let userList = [];

    if (this.state.users.length) {
      this.state.users.splice(5, this.state.users.length - 5);

      userList = this.state.users.map((user, index) => {
        return (
          <div className="avatar-item" key={'active-user_' + index}>
            <Avatar uid={user.uid} name={user.userName} url={user.imgUrl} size="s45" />
          </div>
        );
      });
    }

    let url = './active-users.html?' + querystring.stringify(this.state.qs);

    userList.push((
      <div className="avatar-item more" key={'active-user_more'}>
        <a href={url} className="avatar s45"><i className="icon icon-ellipsis"></i></a>
      </div>
    ));

    return (
      <section className="active-user">
        <h2 className="subtitle">人气用户</h2>
        <div className="active-users">
          <div className="row">
            {userList}
          </div>
        </div>
        <Poptip ref='poptip' />
      </section>
    );
  }
}
