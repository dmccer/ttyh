import '../../../less/global/global.less';
import '../../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Post from './index';
import Loading from '../../loading/';
import Poptip from  '../../poptip/';
import LoadMore from '../../load-more/';
import GoTop from '../../gotop/';
import JWeiXin from '../../jweixin/';

export default class TopicPosts extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      qs: querystring.parse(location.search.substring(1)),
      f: 0,
      t: 30
    }

    new JWeiXin(() => {
      this.setState({
        wx_ready: true
      });
    });
  }

  componentDidMount() {
    this.query();

    LoadMore.init(() => {
      this.query();
    });
  }

  query() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_all',
      type: 'GET',
      data: {
        tid: this.state.qs.tid,
        f: this.state.f,
        t: 30
      },
      success: (data) => {
        this.refs.loading.close();

        if (data && data.bbsForumList && data.bbsForumList.length) {
          this.formatForums(data.bbsForumList)

          this.setState({
            posts: this.state.f > 0 ? this.state.posts.concat(data.bbsForumList) : data.bbsForumList,
            f: this.state.f + data.bbsForumList.length
          });
        } else {
          this.refs.poptip.info('没有更多了');
        }
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

  render() {
    return (
      <section className="topic-posts">
        <Post items={this.state.posts} wx_ready={this.state.wx_ready} />
        <GoTop />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<TopicPosts />, $('#page').get(0));
