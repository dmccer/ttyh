import '../../less/global/global.less';
import '../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import PostDetailItem from './post/detail';
import Feedback from './feedback/';
import GoTop from '../gotop/';

import Loading from '../loading/';
import Poptip from '../poptip/';


export default class BBSDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1)),
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_forum',
      type: 'GET',
      cache: false,
      data: {
        id: this.state.qs.fid,
        uid: this.state.qs.uid
      },
      success: (data) => {
        let forum;

        if (data && data.bbsForumList && data.bbsForumList.length) {
          forum = data.bbsForumList[0];

          forum.imgs = forum.imgs_url && forum.imgs_url.split(';') || [];

          this.setState({
            forum: forum
          });
        }

        this.refs.loading.close();

        this.setState({
          load: true
        });
      },
      error: () => {
        this.refs.loading.close();
      }
    })
  }

  del() {
    if (!confirm('确认删除该帖子?')) {
      return;
    }

    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/api/bbs/_del',
      type: 'POST',
      data: {
        uid: this.state.qs.uid,
        token: this.state.qs.token,
        fid: this.state.forum.id
      },
      success: (data) => {
        this.refs.loading.close();

        this.refs.poptip.success('删除成功');

        setTimeout(() => {
          history.back();
        }, 3000);
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }

        this.refs.loading.close();
        this.refs.poptip.success('删除失败');
      }
    });
  }

  follow() {
    this.refs.loading.show('请求中...');

    $.ajax({
      url: '/mvc/followForBBS_' + this.state.forum.uid,
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
        this.fetch();
      },
      error: (xhr) => {
        if (xhr.status === 403) {
          location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/login.html');
        }

        this.refs.loading.close();
        this.refs.poptip.success('关注失败');
      }
    });
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

ReactDOM.render(<BBSDetail />, $('#page').get(0));
