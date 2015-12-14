import './index.less';

import React from 'react';
import Poptip from '../../poptip/';

export default class Post extends React.Component {
  constructor() {
    super();

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/mvc/bbs/hot_user',
      type: 'GET',
      success: (data) => {
        this.setState({
          users: data.bbsUserDoSortDTOList
        });
      },
      error: () => {
        this.refs.poptip.warn('加载活跃用户失败');
      }
    })
  }

  render() {
    let userList = this.state.users.splice(0, 6).map((user, index) => {
      return (
        <div className="avatar" key={'active-user_' + index}>
          <a href="#" title={user.userName}><img src={user.imgUrl} /></a>
        </div>
      )
    });

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
