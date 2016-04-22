import '../../less/global/global.less';
import '../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';
import GoTop from '../gotop/';
import JWeiXin from '../jweixin/';
import Loading from '../loading/';
import Poptip from '../poptip/';
import AH from '../helper/ajax';
import {
  Forum,
  FollowUser,
  RemoveCommend
} from './model/';


export default class BBSDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
      localUser: JSON.parse(localStorage.getItem('user'))
    };
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.toast);
    this.fetch();
  }

  fetch() {
    this.ah.one(Forum, (data) => {
      let forum;

      if (data && data.bbsForumList && data.bbsForumList.length) {
        forum = data.bbsForumList[0];

        forum.imgs = forum.imgs_url && forum.imgs_url.split(';') || [];

        this.setState({
          forum: forum
        }, () => {
          this.bindShare();
        });
      }

      this.setState({
        load: true
      });
    }, this.state.qs.uid, this.state.qs.fid);
  }

  bindShare() {
    let forum = this.state.forum;
    let logo = 'http://ttyhuo-img.b0.upaiyun.com/2016/02/23/01/33_18_upload_usericonimage_file54.png!small';

    new JWeiXin(() => {
      wx.onMenuShareTimeline({
        title: forum.title,
        link: location.href,
        imgUrl: logo,
        success: () => {},
        cancel: () => {}
      });

      wx.onMenuShareAppMessage({
        title: forum.title,
        desc: forum.content,
        link: location.href,
        imgUrl: logo,
        success: () => {},
        cancel: () => {}
      });
    });
  }

  del() {
    if (!confirm('确认删除该帖子?')) {
      return;
    }

    this.ah.one(RemoveCommend, {
      success: (data) => {
        this.refs.poptip.success('删除成功');

        setTimeout(() => {
          history.back();
        }, 3000);
      },
      error: () => {
        this.refs.poptip.success('删除失败');
      }
    }, {
      uid: this.state.qs.uid,
      token: this.state.localUser && this.state.localUser.token || null,
      fid: this.state.forum.id
    });
  }

  follow() {
    this.ah.one(FollowUser, {
      success: (data) => {
        if (data.errMsg) {
          this.refs.poptip.success(data.errMsg);

          return;
        }

        this.refs.poptip.success('关注成功');
        this.forceUpdate();
      },
      error: (xhr) => {
        this.refs.poptip.warn('关注失败');
      }
    }, this.state.forum.uid);
  }

  praise() {
    this.fetch();
  }

  renderDetail() {
    return this.state.load ? (<PostDetailItem
      forum={this.state.forum}
      follow={this.follow.bind(this)}
      del={this.del.bind(this)} />) : null;
  }

  renderFeedback() {
    return this.state.load ? (<Feedback
      fid={this.state.qs.fid}
      forum={this.state.forum}
      onPraise={this.praise.bind(this)}
    />) : null;
  }

  render() {
    return (
      <section className="post-detail">
        {this.renderDetail()}
        {this.renderFeedback()}
        <GoTop />
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    )
  }
}

ReactDOM.render(<BBSDetail />, document.querySelector('.page'));
